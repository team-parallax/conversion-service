import { ConversionQueueService } from "../service/conversion/conversionQueue"
import { EConversionStatus } from "../service/conversion/enum"
import { IConversionStatusResponse } from "../service/conversion/interface"
import { NoSuchConversionIdError } from "../constants"
import { createConversionRequests } from "./dataFactory"
import { v4 as uuid } from "uuid"
describe("ConversionQueueService should pass all tests", () => {
	const conversionQueueService = new ConversionQueueService()
	beforeEach(() => {
		conversionQueueService.conversionLog = new Map()
		conversionQueueService.conversionQueue = []
		conversionQueueService.convertedQueue = []
	})
	describe("Should throw an NoSuchConversionIdError", () => {
		const nonAvailableConversionId = uuid()
		it("When trying to retrieve non-existent status", () => {
			/* Act */
			const getStatus = jest.fn((): IConversionStatusResponse => {
				return conversionQueueService.getStatusById(nonAvailableConversionId)
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
				return conversionQueueService.changeConvLogEntry(nonAvailableConversionId, status)
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
				} = conversionQueueService.addToConversionQueue(request)
				conversionIds.push(conversionId)
			}
			/* Assert */
			for (const convId of conversionIds) {
				const convLogElement = conversionQueueService.conversionLog.get(convId)
				if (convLogElement) {
					const isInConversionQueue = conversionQueueService.conversionQueue.find(
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