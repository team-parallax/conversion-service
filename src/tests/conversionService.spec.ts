import { ConversionService } from "../service/conversion"
import { EConversionWrapper } from "../enum"
import { IConversionFile } from "../abstract/converter/interface"
import {
	IConversionProcessingResponse,
	IConversionRequestBody
} from "../service/conversion/interface"
import {
	MaxConversionTriesError,
	UnsupportedConversionFormatError
} from "../constants"
import { TConversionRequestFormatSummary } from "../abstract/converter/types"
import { createConversionRequestDummy } from "./helper/dataFactory"
describe("Conversion Service should pass all tests", () => {
	const conversionService = new ConversionService()
	it("update should return 'undefined' when 'isCurrentlyConverting' is 'true'", async () => {
		/* Arrange */
		conversionService.isCurrentlyConverting = true
		/* Act */
		const executeUpdate = async (): Promise<void> => await conversionService.update()
		/* Assert */
		await expect(executeUpdate()).resolves.toBeUndefined()
	})
	it("update should resolve when 'isCurrentlyConverting' is 'false'", async () => {
		/* Arrange */
		conversionService.isCurrentlyConverting = false
		/* Act */
		const executeUpdate = async (): Promise<void> => await conversionService.update()
		/* Assert */
		await expect(executeUpdate()).resolves.toBeUndefined()
	})
	it(
		"wrapConversion should throw an error because max-retries value for conversion is reached",
		async () => {
			/* Arrange */
			process.env.MAX_CONVERSION_TRIES = "2"
			const conversionFile: IConversionFile = createConversionRequestDummy("mp3", "mp4")
			/* Act */
			/* Assert */
			await expect(
				conversionService.wrapConversion(conversionFile)
			).rejects.toThrow(MaxConversionTriesError)
		}
	)
	it(
		"processConversionRequest should throw an 'UnsupportedConversionFormatError' because invalid formats are passed", async () => {
			/* Arrange */
			const testFormats: IConversionRequestBody = {
				file: Buffer.from("test buffer"),
				filename: "foobar",
				originalFormat: "mp3",
				targetFormat: "pdf"
			}
			/* Act */
			const getProcessingResult = async (): Promise<IConversionProcessingResponse> => {
				return conversionService.processConversionRequest(testFormats)
			}
			/* Assert */
			await expect(
				getProcessingResult()
			).rejects.toThrow(UnsupportedConversionFormatError)
		}
	)
	describe("supportsConversion returns the correct value for input formats", () => {
		const isSupportedConversion = async (
			{
				sourceFormat,
				targetFormat
			}: TConversionRequestFormatSummary
		): Promise<boolean> => {
			return await conversionService.supportsConversion(sourceFormat, targetFormat)
		}
		it("should return false because of illegal input", async () => {
			/* Arrange */
			const sourceFormat = ""
			const targetFormat = ""
			/* Act */
			const isConvertable = await isSupportedConversion({
				sourceFormat,
				targetFormat
			})
			/* Assert */
			expect(isConvertable).toBe(false)
		})
		it("should return false for conversion from mp3 to jpg", async () => {
			/* Arrange */
			const sourceFormat = "mp3"
			const targetFormat = "jpg"
			/* Act */
			const isConvertable = await isSupportedConversion({
				sourceFormat,
				targetFormat
			})
			/* Assert */
			expect(isConvertable).toBe(false)
		})
		it("should return true for jpg to png", async () => {
			/* Arrange */
			const sourceFormat = "jpg"
			const targetFormat = "png"
			/* Act */
			const isConvertable = await isSupportedConversion({
				sourceFormat,
				targetFormat
			})
			/* Assert */
			expect(isConvertable).toBe(true)
		})
	})
	describe("determineConverter should return the default set highest priority wrapper", () => {
		const initEnv = process.env
		afterAll(() => {
			process.env = {
				...initEnv
			}
		})
		beforeEach(() => {
			process.env = {
				...initEnv
			}
		})
		it("should return unoconv as wrapper", () => {
			process.env.CONVERT_TO_ODT_WITH = EConversionWrapper.unoconv
			const formats: TConversionRequestFormatSummary = {
				sourceFormat: "html",
				targetFormat: "odt"
			}
			/* Act */
			const getConversionWrapper = (
				formats: TConversionRequestFormatSummary
			): EConversionWrapper => conversionService.determineConverter(formats)
			/* Assert */
			expect(getConversionWrapper(formats)).toEqual(EConversionWrapper.unoconv)
		})
		it("should return ffmpeg as wrapper", () => {
			const formats: TConversionRequestFormatSummary = {
				sourceFormat: "mp3",
				targetFormat: "mp4"
			}
			/* Act */
			const getConversionWrapper = (
				formats: TConversionRequestFormatSummary
			): EConversionWrapper => conversionService.determineConverter(formats)
			/* Assert */
			expect(getConversionWrapper(formats)).toEqual(EConversionWrapper.ffmpeg)
		})
		it("should return imagemagick as wrapper because a rule is set for png conversions", () => {
			process.env.CONVERT_TO_PNG_WITH = EConversionWrapper.imagemagick
			const formats: TConversionRequestFormatSummary = {
				sourceFormat: "jpeg",
				targetFormat: "png"
			}
			/* Act */
			const getConversionWrapper = (
				formats: TConversionRequestFormatSummary
			): EConversionWrapper => conversionService.determineConverter(formats)
			/* Assert */
			expect(getConversionWrapper(formats)).toEqual(EConversionWrapper.imagemagick)
		})
	})
})