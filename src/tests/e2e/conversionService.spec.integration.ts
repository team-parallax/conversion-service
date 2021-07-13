// eslint-disable-next-line unused-imports/no-unused-imports-ts
import * as expectedFormatResponseBody from "./responses/format-response.json"
import { Api } from "../../service/api"
import { ConversionService } from "../../service/conversion"
import { TConversionFormats } from "../../abstract/converter/types"
import request from "supertest"
beforeAll(() => {
	const conversionService = new ConversionService()
})
const {
	app
} = new Api()
const getApiResponse = async (apiRoute: string): Promise<request.Test> => {
	const route = apiRoute.startsWith("/")
		? apiRoute
		: `/${apiRoute}`
	return await request(app).get(route)
}
const getResultBody = async (apiRoute: string): Promise<unknown> => {
	const result = await getApiResponse(apiRoute)
	return result.body
}
describe("It should handle different requests correctly", () => {
	it("should receive a 'pong' response", async () => {
		/* Arrange */
		const testRoute = "ping"
		/* Act */
		const getPingResult = async (): Promise<unknown> => await getResultBody(testRoute)
		/* Assert */
		await expect(getPingResult()).resolves.toBe("pong")
	})
	it("should get all conversion supported formats", async () => {
		/* Arrange */
		const testRoute = "/formats"
		/* Act */
		const getFormatsResponse = async (): Promise<unknown> => {
			const body = await getResultBody(testRoute)
			return body
		}
		const hasExpectedFormatsLength = async (): Promise<boolean> => {
			const {
				document
			} = await getFormatsResponse() as {
				document: TConversionFormats
			}
			return document.length === expectedFormatResponseBody.document.length
		}
		/* Assert */
		await expect(getFormatsResponse()).resolves.toBeDefined()
		await expect(getFormatsResponse()).resolves.toHaveProperty("document")
		await expect(hasExpectedFormatsLength()).resolves.toBe(true)
	})
})