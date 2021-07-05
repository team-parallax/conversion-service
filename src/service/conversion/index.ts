/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { ConversionQueue } from "./queue"
import { ConverterService } from "../../abstract/converter/service"
import { EConversionStatus } from "./enum"
import { FFmpegWrapper } from "../ffmpeg"
import {
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
import { UnoconvWrapper } from "../unoconv"
import {
	deleteFile,
	writeToFile
} from "../file-io"
import { v4 as uuidV4 } from "uuid"
import config, { initializeConversionWrapperMap } from "../../config"
export class ConversionService extends ConverterService {
	constructor() {
		super()
		const {
			conversionWrapperConfiguration: {
				availableWrappers: availableWrapperInterfaces
			}
		} = config
		const availableWrappers = availableWrapperInterfaces.map(
			wrapperInterface => wrapperInterface.binary
		)
		this.converterMap = initializeConversionWrapperMap(availableWrappers)
	}
	public addToConversionQueue(requestObject: IConversionFile): IConversionProcessingResponse {
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
			this.queueService.isCurrentlyConverting = true
			this.queueService.currentlyConvertingFile = fileToProcess
			this.queueService.changeConvLogEntry(conversionId, EConversionStatus.processing)
			try {
				const conversionResponse: IConversionFile = await this.wrapConversion(fileToProcess)
				/* Delete input file. */
				await deleteFile(path)
				this.queueService.changeConvLogEntry(
					conversionId,
					EConversionStatus.converted,
					conversionResponse.path
				)
			}
			catch (err) {
				this.logger.error(`Caught error during conversion:\n${err}`)
				if (err instanceof MaxConversionTriesError) {
					this.queueService.changeConvLogEntry(conversionId, EConversionStatus.erroneous)
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
		return this.queueService.getStatusById(fileId)
	}
	public async processConversionRequest({
		file,
		filename,
		originalFormat,
		targetFormat
	}: IConversionRequestBody): Promise<IConversionProcessingResponse> {
		// TODO: Get origin from filename (#25)
		const origin = originalFormat?.replace(/\./, "") ?? ""
		const target = targetFormat.replace(/\./, "")
		const supports = await this.supportsConversion(origin, target)
		if (!supports) {
			throw new UnsupportedConversionFormatError(`Your input contains unsupported conversion formats. ${originalFormat} or ${targetFormat} is not supported.`)
		}
		const conversionId = uuidV4()
		const inPath = `input/${conversionId}.${origin}`
		await writeToFile(inPath, file)
		const conversionRequest: IConversionFile = {
			conversionId,
			path: inPath,
			retries: 0,
			sourceFormat: origin,
			targetFormat: target
		}
		return this.addToConversionQueue(conversionRequest)
	}
	async supportsConversion(sourceFormat: string, targetFormat: string): Promise<boolean> {
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
	private async update(): Promise<void> {
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