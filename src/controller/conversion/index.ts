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
	EHttpResponseCodes
} from "../../constants"
import { EConversionStatus } from "../../service/conversion/enum"
import {
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequestBody,
	IUnsupportedConversionFormatError
} from "../../service/conversion/interface"
import { IConversionStatus, TApiConvertedCompatResponseV1 } from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
import { getConvertedFileNameAndPath } from "../../service/conversion/util"
import { getType } from "mime"
import { readFileToBuffer } from "../../service/file-io"
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
	public async getConvertedFile(
		@Request() req: express.Request,
		@Path() conversionId: string,
		@Query("v2") isV2Request: boolean
	): Promise<IConversionStatus> {
		try {
			const statusResponse = this.conversionService.getConvertedFile(conversionId)
			const {
				retries,
				status,
				targetFormat
			} = statusResponse
			if (status === EConversionStatus.converted) {
				if (!isV2Request) {
					const conversionFileProperties = getConvertedFileNameAndPath(
						conversionId, targetFormat
					)
					const resultFile = await readFileToBuffer(conversionFileProperties.filePath)
					const response: TApiConvertedCompatResponseV1 = {
						...statusResponse,
						failures: retries,
						resultFile
					}
					return response
				}
			}
			this.setStatus(EHttpResponseCodes.ok)
			return statusResponse
		}
		catch (err) {
			this.setStatus(EHttpResponseCodes.notFound)
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			return {
				conversionId,
				status: err.message
			} as IConversionStatus
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
		@Path("conversionId") conversionId: string
	): Promise<unknown> {
		try {
			const {
				conversionId: fileId,
				status,
				targetFormat
			} = this.conversionService.getConvertedFile(conversionId)
			this.setStatus(EHttpResponseCodes.ok)
			if (status === "converted") {
				const {
					fileName,
					filePath
				} = getConvertedFileNameAndPath(conversionId, targetFormat)
				const stats: fs.Stats = await fs.promises.stat(filePath)
				this.setHeader("Content-Type", `${getType(filePath)}`)
				this.setHeader("Content-Length", stats.size.toString())
				/*
				* Removing this line will cause to not launch the download
				* Just serves the file as it is
				*/
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