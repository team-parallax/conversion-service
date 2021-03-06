/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { ConversionQueue } from "./queue"
import { ConverterService } from "../../abstract/converter/service"
import { EConversionStatus } from "./enum"
import { FFmpegWrapper } from "../ffmpeg"
import {
	IApiConversionFormatResponse,
	IConversionFile,
	IConversionStatus
} from "../../abstract/converter/interface"
import {
	IConversionInQueue,
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequestBody
} from "./interface"
import { ImageMagickWrapper } from "../imagemagick"
import {
	MaxConversionTriesError,
	UnsupportedConversionFormatError
} from "../../constants"
import { TConversionFormats } from "../../abstract/converter/types"
import { UnoconvWrapper } from "../unoconv"
import {
	deleteFile,
	writeToFile
} from "../file-io"
import { transformRequestBodyToConversionFile } from "./util"
import config, { initializeConversionWrapperMap } from "../../config"
const {
	conversionWrapperConfiguration: {
		availableWrappers: availableWrapperInterfaces
	}
} = config
export class ConversionService extends ConverterService {
	constructor() {
		super()
		const availableWrappers = availableWrapperInterfaces.map(
			wrapperInterface => wrapperInterface.binary
		)
		this.converterMap = initializeConversionWrapperMap(availableWrappers)
	}
	public addToConversionQueue(requestObject: IConversionFile): IConversionProcessingResponse {
		this.logger.log(`Add to conversion-queue: ${requestObject.conversionId}`)
		const {
			conversionId
		} = this.queueService.addToConversionQueue(requestObject)
		// eslint-disable-next-line no-void
		void this.update()
		return {
			conversionId
		}
	}
	async convertFile(): Promise<void> {
		const fileToProcess = this.queueService.getNextQueueElement()
		if (fileToProcess) {
			const {
				conversionId,
				path
			} = fileToProcess
			this.logger.log(`Starting conversion process for ${conversionId}`)
			this.queueService.isCurrentlyConverting = true
			this.queueService.currentlyConvertingFile = fileToProcess
			this.logger.log(`Change conversion-log status to 'processing' for ${conversionId}`)
			this.queueService.changeConvLogEntry(conversionId, EConversionStatus.processing)
			try {
				await this.wrapConversion(fileToProcess)
				this.logger.log("Done! Unset current conversion file")
				this.conversionQueue.currentlyConvertingFile = null
				/* Delete input file. */
				this.logger.log(`Deleting original input file at ${path}`)
				await deleteFile(path)
			}
			catch (err) {
				this.logger.error(`Caught error during conversion:\n${err}`)
				if (err instanceof MaxConversionTriesError) {
					this.queueService.changeConvLogEntry(conversionId, EConversionStatus.erroneous)
					/* Delete input file as it is unconvertable */
					await deleteFile(path)
				}
				else {
					this.queueService.changeConvLogEntry(conversionId, EConversionStatus.inQueue)
				}
			}
			finally {
				this.isCurrentlyConverting = false
				void this.update()
			}
		}
	}
	public getConversionQueueStatus(): IConversionQueueStatus {
		this.logger.log(`Fetch conversion-queue status`)
		const conversions: IConversionInQueue[] = []
		for (const [key, value] of this.queueService.conversionLog) {
			const queuePosition: number = this.queueService.conversionQueue.findIndex(
				element => element.conversionId === key
			)
			if (value.status === EConversionStatus.inQueue) {
				conversions.push({
					...value,
					conversionId: key,
					queuePosition
				})
			}
		}
		return {
			conversions,
			remainingConversions: this.queueLength
		}
	}
	public getConvertedFile(fileId: string): IConversionStatus {
		this.logger.log(`Fetch conversion status for ${fileId}`)
		return this.queueService.getStatusById(fileId)
	}
	public async getSupportedConversionFormats(): Promise<IApiConversionFormatResponse> {
		this.logger.log("Fetch conversion formats")
		const formats: Promise<TConversionFormats>[] = []
		for (const wrapperName of this.converterMap.keys()) {
			const wrapper = this.converterMap.get(wrapperName)
			formats.push(wrapper?.getSupportedConversionFormats() as Promise<TConversionFormats>)
		}
		const totalFormats = await Promise.all(formats)
		return {
			document: [...new Set(...totalFormats)]
		}
	}
	public async processConversionRequest(
		conversionRequestBody: IConversionRequestBody
	): Promise<IConversionProcessingResponse> {
		const {
			file,
			filename,
			originalFormat,
			targetFormat
		} = conversionRequestBody
		const origin = originalFormat?.replace(/\./, "") ?? ""
		const target = targetFormat.replace(/\./, "")
		const supports = await this.supportsConversion(origin, target)
		if (!supports) {
			throw new UnsupportedConversionFormatError(`Your input contains unsupported conversion formats. ${originalFormat} or ${targetFormat} is not supported.`)
		}
		const conversionRequest: IConversionFile = transformRequestBodyToConversionFile({
			...conversionRequestBody,
			originalFormat: origin,
			targetFormat: target
		})
		await writeToFile(conversionRequest.path, file)
		return this.addToConversionQueue(conversionRequest)
	}
	async supportsConversion(sourceFormat: string, targetFormat: string): Promise<boolean> {
		this.logger.log(`Retrieve convertability from '${sourceFormat}' to '${targetFormat}'`)
		const isFfmpegConvertable = await FFmpegWrapper.canConvert({
			sourceFormat,
			targetFormat
		})
		const isUnoconvConvertable = await UnoconvWrapper.canConvert({
			sourceFormat,
			targetFormat
		})
		const isImageMagickConvertable = await ImageMagickWrapper.canConvert({
			sourceFormat,
			targetFormat
		})
		return isFfmpegConvertable || isImageMagickConvertable || isUnoconvConvertable
	}
	public async update(): Promise<void> {
		if (!this.isCurrentlyConverting) {
			return await new Promise((resolve, reject) => {
				try {
					this.convertFile()
					resolve()
				}
				catch (err) {
					reject(err)
				}
			})
		}
		return undefined
	}
	get isCurrentlyConverting(): boolean {
		return this.queueService.isCurrentlyConverting
	}
	set isCurrentlyConverting(isConverting: boolean) {
		this.queueService.isCurrentlyConverting = isConverting
	}
	get queueService(): ConversionQueue {
		return this.conversionQueue
	}
	get queueLength(): number {
		return this.queueService.conversionQueue.length
	}
}