import { EConversionStatus } from "../enum"
import {
	IConversionBase,
	IConversionFile,
	IConversionStatus
} from "../../../abstract/converter/interface"
import { IConversionInQueue } from "../interface"
import { InvalidPathError, NoSuchConversionIdError } from "../../../constants"
import { TConversionFiles, TConversionIdToStatusMap } from "./types"
const initialIdMap: TConversionIdToStatusMap = new Map()
export class ConversionQueue {
	private static instance: ConversionQueue
	private currentlyConverting!: IConversionFile | null
	private isConverting!: boolean
	constructor(
		private convLog: TConversionIdToStatusMap = initialIdMap,
		private conversion: TConversionFiles = []
	) {
		if (ConversionQueue.instance) {
			return ConversionQueue.instance
		}
		ConversionQueue.instance = this
		this.currentlyConverting = null
		this.isConverting = false
		return this
	}
	public addToConversionQueue(
		requestObject: IConversionFile,
		retries: number = 1
	): IConversionBase {
		this.conversion.push(requestObject)
		this.convLog.set(requestObject.conversionId, {
			...requestObject,
			status: EConversionStatus.inQueue
		})
		return {
			conversionId: requestObject.conversionId
		}
	}
	public changeConvLogEntry(
		conversionId: string,
		status: EConversionStatus,
		convertedFilePath?: string
	): void {
		const element = this.convLog.get(conversionId)
		if (!element) {
			throw new NoSuchConversionIdError("No such conversion element")
		}
		else {
			if (status === EConversionStatus.converted) {
				if (!convertedFilePath) {
					throw new InvalidPathError(`No path given for id: ${conversionId}`)
				}
				element.path = convertedFilePath
			}
			element.status = status
		}
	}
	public getNextQueueElement(): IConversionFile | undefined {
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
	private response(
		status: EConversionStatus,
		conversionId: string
	): IConversionStatus {
		const requestObject = this.convLog.get(conversionId) as IConversionStatus
		const response: IConversionStatus = {
			...requestObject,
			conversionId,
			status
		}
		if (status === EConversionStatus.inQueue) {
			// Add one to have 1-indexed queue
			const queuePosition: number = this.conversionQueue.findIndex(
				item => item.conversionId === conversionId
			) + 1
			const inQueueResponse: IConversionInQueue = {
				...response,
				queuePosition
			}
			return inQueueResponse
		}
		else if (status === EConversionStatus.converted) {
			const convertedFile = this.conversionLog.get(conversionId) as IConversionStatus
			return {
				...response,
				path: convertedFile.path
			}
		}
		return response
	}
	get conversionLog(): Map<string, Omit<IConversionStatus, "conversionId">> {
		return this.convLog
	}
	set conversionLog(newConversionLog: Map<string, Omit<IConversionStatus, "conversionId">>) {
		this.convLog = newConversionLog
	}
	get conversionQueue(): IConversionFile[] {
		return this.conversion
	}
	set conversionQueue(newConversionQueue: IConversionFile[]) {
		this.conversion = newConversionQueue
	}
	get currentlyConvertingFile(): IConversionFile | null {
		return this.currentlyConverting
	}
	set currentlyConvertingFile(file: IConversionFile | null) {
		this.currentlyConverting = file
	}
	get isCurrentlyConverting(): boolean {
		return this.isConverting
	}
	set isCurrentlyConverting(isNewConvertingVal: boolean) {
		this.isConverting = isNewConvertingVal
	}
}