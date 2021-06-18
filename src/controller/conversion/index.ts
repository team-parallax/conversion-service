import {
	Controller,
	Get,
	Path,
	Post,
	// eslint-disable-next-line unused-imports/no-unused-imports-ts
	Query,
	Request,
	Route,
	Tags
} from "tsoa"
import { ConversionService } from "../../service/conversion"
import {
	DifferentOriginalFormatsDetectedError,
	EHttpResponseCodes,
	basePath
} from "../../constants"
import {
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequestBody,
	IConversionStatus,
	IUnsupportedConversionFormatError
} from "../../service/conversion/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
import { extname } from "path"
import { getType } from "mime"
import express from "express"
import fs from "fs"
import multer from "multer"
@Route("/conversion")
@Tags("Conversion")
export class ConversionController extends Controller {
	@Inject
	private readonly conversionService!: ConversionService
	@Inject
	private readonly logger!: Logger
	/**
	 * Adds the file from the request body to the internal conversion queue.
	 * The files in queue will be processed after the FIFO principle.
	 * @param conversionRequestBody	contains the file to convert
	 */
	@Post("/")
	public async convertFile(
		@Request() request: express.Request
	): Promise<IConversionProcessingResponse | IUnsupportedConversionFormatError> {
		this.logger.log("Conversion requested")
		try {
			const conversionRequest = await this.handleMultipartFormData(request)
			return await this.conversionService.processConversionRequest(conversionRequest)
		}
		catch (error) {
			if (error instanceof DifferentOriginalFormatsDetectedError) {
				this.setStatus(EHttpResponseCodes.badRequest)
			}
			else {
				this.setStatus(EHttpResponseCodes.internalServerError)
			}
			this.logger.error(error.message)
			return {
				message: error.message
			}
		}
	}
	/**
	 * Retrieves the status of the conversion queue and returns all conversions with
	 * their corresponding status and the amount of outstanding conversions.
	 */
	@Get("/")
	public getConversionQueueStatus(): IConversionQueueStatus {
		this.logger.log("Conversion queue status requested")
		return this.conversionService.getConversionQueueStatus()
	}
	/**
	 * Returns the current status for a conversion given a conversionId
	 * @param conversionId Unique identifier for the conversion of a file.
	 */
	@Get("{conversionId}")
	public getConvertedFile(@Path() conversionId: string): IConversionStatus {
		try {
			this.setStatus(EHttpResponseCodes.ok)
			return this.conversionService.getConvertedFile(conversionId)
		}
		catch (err) {
			this.setStatus(EHttpResponseCodes.notFound)
			return {
				conversionId,
				status: err.message
			}
		}
	}
	/**
	 * Returns the current status for a conversion given a conversionId
	 * If status is 'converted' the resulting converted file
	 * will be available to download.
	 * @param conversionId the id of the file-conversion that is requested
	 */
	@Get("{conversionId}/download")
	public async getConvertedFileDownload(
		@Path("conversionId") conversionId: string,
			@Query("extension") extension: string = "mp3"
	): Promise<unknown> {
		try {
			const {
				conversionId: fileId,
				status
			} = this.conversionService.getConvertedFile(conversionId)
			this.setStatus(EHttpResponseCodes.ok)
			if (status === "converted") {
				const fileName = `${fileId}.${extension}`
				const filePath = `${basePath}output/${fileName}`
				const stats: fs.Stats = await fs.promises.stat(filePath)
				this.setHeader("Content-Type", `${getType(filePath)}`)
				this.setHeader("Content-Length", stats.size.toString())
				// Removing this line will cause to not launch the download
				// Just serves the file as it is
				this.setHeader("Content-Disposition", `attachment; filename=${fileName}`)
				return fs.createReadStream(filePath)
			}
			return {
				conversionId,
				status
			}
		}
		catch (err) {
			this.setStatus(EHttpResponseCodes.notFound)
			return {
				conversionId,
				status: err.message
			}
		}
	}
	/**
	 * Handles file-uploads with multipart/formData requests.
	 */
	private async handleMultipartFormData(
		request: express.Request
	): Promise<IConversionRequestBody> {
		const multerSingle = multer().single("conversionFile")
		return new Promise((resolve, reject) => {
			multerSingle(request, express.response, (error: unknown) => {
				if (error) {
					reject(error)
				}
				const {
					originalFormat,
					targetFormat
				} = request?.body
				const {
					file
				} = request
				const fileExtension = extname(file.originalname)
				if (fileExtension !== originalFormat) {
					reject(new DifferentOriginalFormatsDetectedError(
						`The specified 'originalFormat' (${originalFormat}) differs from the one of your uploaded file (${fileExtension}).`
					))
				}
				resolve({
					file: file.buffer,
					filename: file.originalname,
					originalFormat,
					targetFormat
				})
			})
		})
	}
}