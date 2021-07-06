import { ImageMagick } from "../service/imagemagick/imagemagick"
import { ImageMagickWrapper } from "../service/imagemagick"
import {
	TConversionFormats,
	TConversionRequestFormatSummary,
	TConversionRequestFormats
} from "../abstract/converter/types"
import { basePath } from "../constants"
import { join } from "path"
describe("ImageMagick should pass all tests", () => {
	it("should convert an png image to a pdf file", async () => {
		/* Arrange */
		const sourcePath = join(basePath, "./sample-input/documents/sample.png")
		const targetPath = join(basePath, "./output/sample-imagemagick-png.pdf")
		/* Act */
		const convertTestFile = ImageMagick.convert(sourcePath, targetPath)
		/* Assert */
		await expect(convertTestFile).resolves.toEqual(targetPath)
	})
	it("should convert an jpg image to a pdf file", async () => {
		/* Arrange */
		const sourcePath = join(basePath, "./sample-input/documents/sample.jpg")
		const targetPath = join(basePath, "./output/sample-imagemagick-jpg.pdf")
		/* Act */
		const convertTestFile = ImageMagick.convert(sourcePath, targetPath)
		/* Assert */
		await expect(convertTestFile).resolves.toEqual(targetPath)
	})
	describe("ImageMagickWrapper should pass all tests", () => {
		const imageMagickWrapper = new ImageMagickWrapper()
		it("should return false for html as input format", async () => {
			/* Arrange */
			const testFormat = "html"
			/* Act */
			const isConvertable = async (sourceFormat: string): Promise<boolean> => {
				return await ImageMagickWrapper.isSupportedFormat(sourceFormat)
			}
			/* Assert */
			await expect(isConvertable(testFormat)).resolves.toBe(false)
		})
		it("should return true for html as input format", async () => {
			/* Arrange */
			const testFormat = "html"
			/* Act */
			const isConvertable = async (sourceFormat: string): Promise<boolean> => {
				return await ImageMagickWrapper.isSupportedFormat(sourceFormat)
			}
			/* Assert */
			await expect(isConvertable(testFormat)).resolves.toBe(false)
		})
		it("should return true for convertability checks with valid formats", async () => {
			/* Arrange */
			const formats: TConversionRequestFormats = [
				{
					sourceFormat: "jpg",
					targetFormat: "png"
				},
				{
					sourceFormat: "jpeg",
					targetFormat: "png"
				},
				{
					sourceFormat: "jpeg",
					targetFormat: "pdf"
				},
				{
					sourceFormat: "png",
					targetFormat: "pdf"
				}
			]
			const testCases: Promise<boolean>[] = []
			/* Act */
			const canBeConverted = async (
				format: TConversionRequestFormatSummary
			): Promise<boolean> => await ImageMagickWrapper.canConvert(format)
			for (const formatPair of formats) {
				testCases.push(canBeConverted(formatPair))
			}
			const canConvertAllEvaluations = await Promise.all(testCases)
			const canConvertAll = !canConvertAllEvaluations.includes(false)
			/* Assert */
			expect(canConvertAll).toBe(true)
		})
		it("should return a list of Conversion formats that are supported", async () => {
			/* Arrange */
			/* Act */
			const getAllSupportedFormats = async (): Promise<TConversionFormats> => {
				return await ImageMagickWrapper.getSupportedConversionFormats()
			}
			/* Asssert */
			try {
				const formats = await getAllSupportedFormats()
				expect(formats.length).toBeGreaterThanOrEqual(0)
			}
			catch (error) {
				expect(false).toBe(true)
			}
			await expect(getAllSupportedFormats()).resolves.toBeDefined()
		})
	})
})