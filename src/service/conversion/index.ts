/* eslint-disable no-void */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { CapabilityService } from "../capabilities"
import { ConversionQueueService } from "./conversionQueue"
import { EConversionStatus } from "./enum"
import { FFmpegWrapper } from "../ffmpeg"
import {
	IConversionInQueue,
	IConversionProcessingResponse,
	IConversionQueueStatus,
	IConversionRequest,
	IConversionRequestBody,
	IConversionStatus
} from "./interface"
import {
	IConversionResult, IFormat, TCapabilities
} from "../ffmpeg/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../logger"
import { UnsupportedConversionFormatError } from "../../constants"
import { deleteFile, writeToFile } from "../file-io"
import { v4 as uuidV4 } from "uuid"
export class ConversionService {
	@Inject
	private readonly conversionQueueService!: ConversionQueueService
	@Inject
	private readonly ffmpeg!: FFmpegWrapper
	@Inject
	private readonly logger!: Logger
	public addToConversionQueue(requestObject: IConversionRequest): IConversionProcessingResponse {
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
				name,
				path,
				sourceFormat,
				targetFormat
			} = fileToProcess
			this.queueService.isCurrentlyConverting = true
			this.queueService.currentlyConvertingFile = fileToProcess
			this.queueService.changeConvLogEntry(conversionId, EConversionStatus.processing)
			try {
				const conversionResponse: IConversionResult = await this.ffmpeg
					.convertToTargetFormat(path, conversionId, sourceFormat, targetFormat)
				/* Delete input file. */
				await deleteFile(path)
				this.conversionQueueService.addToConvertedQueue(
					conversionId,
					{
						outputFilename: name,
						outputFilepath: conversionResponse.outputFilepath
					}
				)
				this.queueService.changeConvLogEntry(conversionId, EConversionStatus.converted)
			}
			catch (err) {
				this.logger.error(`Re-add the file conversion request due to error before: ${err}`)
				this.queueService.addToConversionQueue(fileToProcess)
				this.queueService.changeConvLogEntry(conversionId, EConversionStatus.inQueue)
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
		const origin = originalFormat.replace(/\./, "")
		const target = targetFormat.replace(/\./, "")
		const supports = await this.supportsConversion(origin, target)
		if (!supports) {
			throw new UnsupportedConversionFormatError(`Your input contains unsupported conversion formats. ${originalFormat} or ${targetFormat} is not supported.`)
		}
		const conversionId = uuidV4()
		const inPath = `input/${conversionId}.${origin}`
		await writeToFile(inPath, file)
		const request: IConversionRequest = {
			conversionId,
			isConverted: false,
			name: filename,
			path: inPath,
			sourceFormat: origin,
			targetFormat: target
		}
		return this.addToConversionQueue(request)
	}
	async supportsConversion(from: string, to: string): Promise<boolean> {
		const capabilityService: CapabilityService = new CapabilityService()
		const formats = await capabilityService.getAvailableFormats()
		const supportsFrom = this.containsCapability<IFormat>(formats, from)
		const supportsTo = this.containsCapability<IFormat>(formats, to)
		return supportsFrom && supportsTo
	}
	private containsCapability<T extends TCapabilities>(
		capabilities: T[], capability: string
	): boolean {
		return capabilities.find(cap => cap.name === capability) !== undefined
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
	get queueService(): ConversionQueueService {
		return this.conversionQueueService
	}
	get queueLength(): number {
		return this.queueService.conversionQueue.length
	}
}