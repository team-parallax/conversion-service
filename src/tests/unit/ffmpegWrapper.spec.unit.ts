import { FFmpegWrapper } from "../../service/ffmpeg"
import { TConversionFormats, TConversionRequestFormatSummary } from "../../abstract/converter/types"
import { basePath } from "../../constants"
import { createDirectoryIfNotPresent } from "../../service/file-io"
import path from "path"
beforeAll(async () => {
	const paths = ["input", "output"]
	const dirPromises: Promise<string>[] = []
	for (const dirPath of paths) {
		dirPromises.push(createDirectoryIfNotPresent(path.join(basePath, dirPath)))
	}
	const resp = await Promise.all(dirPromises)
})
describe("FFmpegWrapper should pass all tests", () => {
	const ffmpeg: FFmpegWrapper = new FFmpegWrapper()
	it("should convert .mp3 to .mp4", async () => {
		const conversion = await FFmpegWrapper.convertToTarget(
			{
				conversionId: "ffmConverted",
				path: "./sample-input/aWholesomeLesson.mp3",
				retries: 0,
				sourceFormat: "mp3",
				targetFormat: "mp4"
			}
		)
		expect(conversion).toBeDefined()
	})
	it("should convert .mp3 to .mp4 with different path", async () => {
		const conversion = await FFmpegWrapper.convertToTarget(
			{
				conversionId: "ffmConverted",
				path: "sample-input/aWholesomeLesson.mp3",
				retries: 3,
				sourceFormat: "mp3",
				targetFormat: "mp4"
			}
		)
		expect(conversion).toBeDefined()
	})
	it("should retrieve a non-empty list of supported conversion formats", async (done: jest.DoneCallback) => {
		/* Arrange */
		/* Act */
		const getSupportedConversionFormats = async (): Promise<TConversionFormats> => {
			return await FFmpegWrapper.getSupportedConversionFormats()
		}
		const isNonEmptyCollection = async (): Promise<boolean> => {
			const retrievedFormats = await getSupportedConversionFormats()
			return retrievedFormats.length > 0
		}
		/* Assert */
		await expect(getSupportedConversionFormats()).resolves.toBeDefined()
		await expect(isNonEmptyCollection()).resolves.toBe(true)
		done()
	})
	it("should return true for mp3 to mp4", async () => {
		/* Arrange */
		const testFormats = {
			sourceFormat: "mp3",
			targetFormat: "mp4"
		}
		/* Act */
		const canConvert = async (): Promise<boolean> => await FFmpegWrapper.canConvert(testFormats)
		/* Assert */
		await expect(canConvert()).resolves.toBe(true)
	})
	it("should return false for jpg to mp4", async () => {
		/* Arrange */
		const testFormats = {
			sourceFormat: "jpg",
			targetFormat: "mp4"
		}
		/* Act */
		const canConvert = async (): Promise<boolean> => await FFmpegWrapper.canConvert(testFormats)
		/* Assert */
		await expect(canConvert()).resolves.toBe(false)
	})
	describe("It should return true if formats can be converted and false otherwise", () => {
		it("should be able to convert from mp3 to mp4", async () => {
			/* Arrange */
			const testFormats: TConversionRequestFormatSummary = {
				sourceFormat: "mp3",
				targetFormat: "mp4"
			}
			/* Act */
			const isSupportedConversion = async (): Promise<boolean> => {
				return await FFmpegWrapper.canConvert(testFormats)
			}
			/* Assert */
			await expect(isSupportedConversion()).resolves.toBe(true)
		})
		it("should be able to convert from ogg to mp3", async () => {
			/* Arrange */
			const testFormats: TConversionRequestFormatSummary = {
				sourceFormat: "ogg",
				targetFormat: "mp3"
			}
			/* Act */
			const isSupportedConversion = async (): Promise<boolean> => {
				return await FFmpegWrapper.canConvert(testFormats)
			}
			/* Assert */
			await expect(isSupportedConversion()).resolves.toBe(true)
		})
		it("should be able to convert from ogv to mp4", async () => {
			/* Arrange */
			const testFormats: TConversionRequestFormatSummary = {
				sourceFormat: "ogv",
				targetFormat: "mp4"
			}
			/* Act */
			const isSupportedConversion = async (): Promise<boolean> => {
				return await FFmpegWrapper.canConvert(testFormats)
			}
			/* Assert */
			await expect(isSupportedConversion()).resolves.toBe(true)
		})
		it("should be able to convert from ogg to mp4", async () => {
			/* Arrange */
			const testFormats: TConversionRequestFormatSummary = {
				sourceFormat: "ogg",
				targetFormat: "mp4"
			}
			/* Act */
			const isSupportedConversion = async (): Promise<boolean> => {
				return await FFmpegWrapper.canConvert(testFormats)
			}
			/* Assert */
			await expect(isSupportedConversion()).resolves.toBe(true)
		})
		it("should be able to convert from webm to mp4", async () => {
			/* Arrange */
			const testFormats: TConversionRequestFormatSummary = {
				sourceFormat: "webm",
				targetFormat: "mp4"
			}
			/* Act */
			const isSupportedConversion = async (): Promise<boolean> => {
				return await FFmpegWrapper.canConvert(testFormats)
			}
			/* Assert */
			await expect(isSupportedConversion()).resolves.toBe(true)
		})
		it("should be able to convert from ogg to html", async () => {
			/* Arrange */
			const testFormats: TConversionRequestFormatSummary = {
				sourceFormat: "ogg",
				targetFormat: "html"
			}
			/* Act */
			const isSupportedConversion = async (): Promise<boolean> => {
				return await FFmpegWrapper.canConvert(testFormats)
			}
			/* Assert */
			await expect(isSupportedConversion()).resolves.toBe(false)
		})
	})
})