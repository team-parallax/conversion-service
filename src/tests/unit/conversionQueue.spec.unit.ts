import { ConversionQueue } from "../../service/conversion/queue"
import { EConversionStatus } from "../../service/conversion/enum"
import { IConversionStatusResponse } from "../../service/conversion/interface"
import { InvalidPathError, NoSuchConversionIdError } from "../../constants"
import { createChangeConvLogParams, createConversionRequests } from "../helper/dataFactory"
import { v4 as uuid } from "uuid"
describe("ConversionQueueService should pass all tests", () => {
	const conversionQueue = new ConversionQueue()
	beforeEach(() => {
		conversionQueue.conversionLog = new Map()
		conversionQueue.conversionQueue = []
	})
	it("should throw an InvalidPathError because no path was provided with 'converted' state", () => {
		/* Arrange */
		const {
			conversionId,
			convertedFilePath,
			status
		} = createChangeConvLogParams()
		/* Act */
		conversionQueue.conversionLog.set(conversionId, {
			path: convertedFilePath ?? "",
			retries: 0,
			sourceFormat: "html",
			status,
			targetFormat: "pdf"
		})
		const tryChangeConvLogEntry = (): void => {
			return conversionQueue.changeConvLogEntry(conversionId, status, convertedFilePath)
		}
		/* Assert */
		expect(tryChangeConvLogEntry).toThrow(InvalidPathError)
	})
	it("should change a conv log entry with given parameters", () => {
		/* Arrange */
		const {
			conversionId,
			convertedFilePath,
			status
		} = createChangeConvLogParams(true)
		/* Act */
		conversionQueue.conversionLog.set(conversionId, {
			path: convertedFilePath ?? "",
			retries: 0,
			sourceFormat: "html",
			status,
			targetFormat: "pdf"
		})
		const tryChangeConvLogEntry = (): void => {
			return conversionQueue.changeConvLogEntry(conversionId, status, convertedFilePath)
		}
		tryChangeConvLogEntry()
		const updatedEntry = conversionQueue.conversionLog.get(conversionId)
		/* Assert */
		expect(tryChangeConvLogEntry).not.toThrow()
		expect(updatedEntry).not.toBeNull()
		expect(updatedEntry?.status).toBe(status)
		expect(updatedEntry?.path).toBe(convertedFilePath)
	})
	it.todo("should add and transform a request to the conversionLog")
	describe("Should throw an NoSuchConversionIdError", () => {
		const nonAvailableConversionId = uuid()
		it("When trying to retrieve non-existent status", () => {
			/* Act */
			const getStatus = jest.fn((): IConversionStatusResponse => {
				return conversionQueue.getStatusById(nonAvailableConversionId)
			})
			/* Assert */
			expect(
				getStatus
			).toThrowError(NoSuchConversionIdError)
		})
		it("When trying to change convLog entry of non-existent element", () => {
			/* Arrange */
			const status = EConversionStatus[0]
			const changeEntryMock = jest.fn(() => {
				return conversionQueue.changeConvLogEntry(nonAvailableConversionId, status)
			})
			/* Assert */
			expect(changeEntryMock).toThrowError(NoSuchConversionIdError)
		})
	})
	describe("Should execute all operations without incidents", () => {
		it("Add Items to the ConversionQueue correctly", () => {
			/* Arrange */
			const sampleSize = 5
			const conversionRequests = createConversionRequests(sampleSize)
			const conversionIds: string[] = []
			for (const request of conversionRequests) {
				const {
					conversionId
				} = conversionQueue.addToConversionQueue(request)
				conversionIds.push(conversionId)
			}
			/* Assert */
			for (const convId of conversionIds) {
				const convLogElement = conversionQueue.conversionLog.get(convId)
				if (convLogElement) {
					const isInConversionQueue = conversionQueue.conversionQueue.find(
						item => item.conversionId === convId
					)
					expect(convLogElement).not.toBeNull()
					expect(convLogElement?.status).toBe(EConversionStatus.inQueue)
					expect(isInConversionQueue).not.toBeUndefined()
				}
				else {
					expect(false).toBe(true)
				}
			}
		})
	})
})