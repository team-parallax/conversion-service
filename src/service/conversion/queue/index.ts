import { EConversionStatus } from "../enum"
import {
	IConversionBase,
	IConversionFile,
	IConversionStatus
} from "../../../abstract/converter/interface"
import { IConversionInQueue } from "../interface"
import {
	InvalidPathError,
	NoSuchConversionIdError
} from "../../../constants"
import {
	TConversionFiles,
	TConversionIdToConversionFileMap,
	TNullableConversionFile
} from "./types"
const initialIdMap: TConversionIdToConversionFileMap = new Map()
export class ConversionQueue {
	private static instance: ConversionQueue
	private currentlyConverting!: TNullableConversionFile
	private isConverting!: boolean
	constructor(
		private convLog: TConversionIdToConversionFileMap = initialIdMap,
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
		retries: number = 0
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
		if (isInConversionQueue) {
			return this.response(EConversionStatus.inQueue, conversionId)
		}
		if (isInConvertedQueue) {
			return this.response(EConversionStatus.converted, conversionId)
		}
		if (this.currentlyConvertingFile?.conversionId === conversionId) {
			return this.response(EConversionStatus.processing, conversionId)
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
	get conversionLog(): TConversionIdToConversionFileMap {
		return this.convLog
	}
	set conversionLog(newConversionLog: TConversionIdToConversionFileMap) {
		this.convLog = newConversionLog
	}
	get conversionQueue(): TConversionFiles {
		return this.conversion
	}
	set conversionQueue(newConversionQueue: TConversionFiles) {
		this.conversion = newConversionQueue
	}
	get currentlyConvertingFile(): TNullableConversionFile {
		return this.currentlyConverting
	}
	set currentlyConvertingFile(file: TNullableConversionFile) {
		this.currentlyConverting = file
	}
	get isCurrentlyConverting(): boolean {
		return this.isConverting
	}
	set isCurrentlyConverting(isNewConvertingVal: boolean) {
		this.isConverting = isNewConvertingVal
	}
}