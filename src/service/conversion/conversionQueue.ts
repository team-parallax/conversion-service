import { EConversionStatus } from "./enum"
import {
	IConversionFinished,
	IConversionInProgress,
	IConversionInQueue,
	IConversionProcessingResponse,
	IConversionRequest,
	IConversionResult,
	IConversionStatus
} from "./interface"
import { IConvertedFile } from "../ffmpeg/interface"
import { NoSuchConversionIdError } from "../../constants"
import { readFileToBuffer } from "../file-io"
export class ConversionQueueService {
	private static instance: ConversionQueueService
	private convLog!: Map<string, Omit<IConversionStatus, "conversionId">>
	private conversion!: IConversionRequest[]
	private converted!: IConversionResult[]
	private currentlyConverting!: IConversionRequest | null
	private isConverting!: boolean
	constructor() {
		if (ConversionQueueService.instance) {
			return ConversionQueueService.instance
		}
		ConversionQueueService.instance = this
		this.convLog = new Map<string, Omit<IConversionStatus, "conversionId">>()
		this.conversion = []
		this.converted = []
		this.currentlyConverting = null
		this.isConverting = false
		return this
	}
	public addToConversionQueue(requestObject: IConversionRequest): IConversionProcessingResponse {
		this.conversion.push(requestObject)
		this.convLog.set(requestObject.conversionId, {
			status: EConversionStatus.inQueue
		})
		return {
			conversionId: requestObject.conversionId
		}
	}
	public async addToConvertedQueue(
		conversionId: string,
		conversionResult: IConvertedFile
	): Promise<IConversionProcessingResponse> {
		const {
			outputFilename,
			outputFilepath
		} = conversionResult
		const resultFile = await readFileToBuffer(outputFilepath)
		this.converted.push({
			conversionId,
			name: outputFilename,
			path: outputFilepath,
			resultFile
		})
		this.currentlyConvertingFile = null
		return {
			conversionId
		}
	}
	public changeConvLogEntry(conversionId: string, status: EConversionStatus): void {
		const element = this.convLog.get(conversionId)
		if (!element) {
			throw new NoSuchConversionIdError("No such conversion element")
		}
		else {
			element.status = status
		}
	}
	public getNextQueueElement(): IConversionRequest | undefined {
		return this.conversionQueue.shift()
	}
	public getStatusById(conversionId: string): IConversionStatus {
		const isInConversionQueue: boolean = this.convLog.get(
			conversionId
		)?.status === EConversionStatus.inQueue
		const isInConvertedQueue: boolean = this.convLog.get(
			conversionId
		)?.status === EConversionStatus.converted
		if (this.currentlyConvertingFile?.conversionId === conversionId) {
			return this.response(EConversionStatus.processing, conversionId)
		}
		if (isInConversionQueue) {
			return this.response(EConversionStatus.inQueue, conversionId)
		}
		if (isInConvertedQueue) {
			return this.response(EConversionStatus.converted, conversionId)
		}
		else {
			throw new NoSuchConversionIdError(`No conversion request found for given conversionId ${conversionId}`)
		}
	}
	public removeFromConvertedQueue(removee: IConversionResult): void {
		this.convertedQueue.splice(this.convertedQueue.indexOf(removee), 1)
	}
	private response(
		status: EConversionStatus,
		conversionId: string
	): IConversionInQueue | IConversionInProgress | IConversionFinished {
		if (status === EConversionStatus.inQueue) {
			// Add one to have 1-indexed queue
			const queuePosition: number = this.conversionQueue.findIndex(
				item => item.conversionId === conversionId
			) + 1
			const response: IConversionInQueue = {
				conversionId,
				queuePosition,
				status
			}
			return response
		}
		else if (status === EConversionStatus.converted) {
			const convertedFile = this.convertedQueue
				.filter(item => item.conversionId === conversionId)[0]
			const response: IConversionFinished = {
				conversionId,
				resultFilePath: convertedFile.path,
				status
			}
			return response
		}
		const response: IConversionInProgress = {
			conversionId,
			status
		}
		return response
	}
	get conversionLog(): Map<string, Omit<IConversionStatus, "conversionId">> {
		return this.convLog
	}
	set conversionLog(newConversionLog: Map<string, Omit<IConversionStatus, "conversionId">>) {
		this.convLog = newConversionLog
	}
	get conversionQueue(): IConversionRequest[] {
		return this.conversion
	}
	set conversionQueue(newConversionQueue: IConversionRequest[]) {
		this.conversion = newConversionQueue
	}
	get convertedQueue(): IConversionResult[] {
		return this.converted
	}
	set convertedQueue(newConvertedQueue: IConversionResult[]) {
		this.converted = newConvertedQueue
	}
	get currentlyConvertingFile(): IConversionRequest | null {
		return this.currentlyConverting
	}
	set currentlyConvertingFile(file: IConversionRequest | null) {
		this.currentlyConverting = file
	}
	get isCurrentlyConverting(): boolean {
		return this.isConverting
	}
	set isCurrentlyConverting(isNewConvertingVal: boolean) {
		this.isConverting = isNewConvertingVal
	}
}