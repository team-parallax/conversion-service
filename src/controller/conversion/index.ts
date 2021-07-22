import {
	Body,
	Controller,
	Deprecated,
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
import { EConversionStatus } from "../../service/conversion/enum"
import {
	EHttpResponseCodes,
	InvalidRequestBodyError
} from "../../constants"
import {
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequestBody,
	IUnsupportedConversionFormatError
} from "../../service/conversion/interface"
import {
	IConversionStatus,
	TApiConvertedCompatResponseV1
} from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
import {
	getConvertedFileNameAndPath,
	handleError,
	handleMultipartFormData
} from "../../service/conversion/util"
import { getType } from "mime"
import { readFromFileSync } from "../../service/file-io"
import express from "express"
import fs from "fs"
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
	 * @param request contains the conversion request and the uploaded file
	 */
	@Post("/v2")
	public async convertFile(
		@Request() request: express.Request
	): Promise<IConversionProcessingResponse | IUnsupportedConversionFormatError> {
		this.logger.log("Conversion requested")
		try {
			const multipartConversionRequest = await handleMultipartFormData(request)
			return await this.conversionService.processConversionRequest(multipartConversionRequest)
		}
		catch (error) {
			return handleError(error)
		}
	}
	/**
	 * LEGACY VERSION - will be deprecated in the future
	 * Adds the file from the request body to the internal conversion queue.
	 * The files in queue will be processed after the FIFO principle.
	 * @param conversionRequestBody	contains the file to convert
	 */
	@Post("/")
	@Deprecated()
	public async convertFileLegacy(
		@Body() requestBody: IConversionRequestBody
	): Promise<IConversionProcessingResponse | IUnsupportedConversionFormatError> {
		this.logger.log("Conversion requested")
		try {
			const conversionRequest: IConversionRequestBody = requestBody
			if (!requestBody) {
				throw new InvalidRequestBodyError()
			}
			return await this.conversionService.processConversionRequest(conversionRequest)
		}
		catch (error) {
			return handleError(error)
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
	public getConvertedFile(
		@Query("v2") isV2Request: boolean = false,
		@Path() conversionId: string,
		@Request() req: express.Request
	): IConversionStatus {
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
					const resultFile = readFromFileSync(conversionFileProperties.filePath)
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
}