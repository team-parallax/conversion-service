import { CapabilityService } from "../service/capabilities"
import { FFmpegWrapper } from "../service/ffmpeg"
import {
	ICodec, IEncoder, IFilter, IFormat
} from "../service/ffmpeg/interface"
describe("CapabilityService should pass all tests", () => {
	const capabilityService = new CapabilityService()
	const ffmpeg = new FFmpegWrapper()
	describe("It should name capabilities correctly", () => {
		it("should convert ffmpeg codec output in correct named format", async (done: jest.DoneCallback) => {
			/* Arrange */
			const unnamedCapabilities = await ffmpeg.getAvailableCodecs()
			const namedCapabilities = capabilityService.nameCapability<ICodec>(unnamedCapabilities)
			const codecs = await capabilityService.getAvailableCodecs()
			/* Assert */
			expect(codecs).toMatchObject(namedCapabilities)
			done()
		})
		it("should convert ffmpeg encoders output in correct named format", async (done: jest.DoneCallback) => {
			/* Arrange */
			const unnamedEncoders = await ffmpeg.getAvailableEncoders()
			const namedEncoders = capabilityService.nameCapability<IEncoder>(unnamedEncoders)
			const encoders = await capabilityService.getAvailableEncoders()
			/* Assert */
			expect(encoders).toMatchObject(namedEncoders)
			done()
		})
		it("should convert ffmpeg filters output in correct named format", async (done: jest.DoneCallback) => {
			/* Arrange */
			const unnamedFilters = await ffmpeg.getAvailableFilters()
			const namedFilters = capabilityService.nameCapability<IFilter>(unnamedFilters)
			const filters = await capabilityService.getAvailableFilters()
			/* Assert */
			expect(filters).toMatchObject(namedFilters)
			done()
		})
		it("should convert ffmpeg formats output in correct named format", async (done: jest.DoneCallback) => {
			/* Arrange */
			const unnamedFormats = await ffmpeg.getAvailableFormats()
			const namedFormats = capabilityService.nameCapability<IFormat>(unnamedFormats)
			const formats = await capabilityService.getAvailableFormats()
			/* Assert */
			expect(formats).toMatchObject(namedFormats)
			for (const name in unnamedFormats) {
				if (Object.prototype.hasOwnProperty.call(unnamedFormats, name)) {
					expect(formats.find(format => format.name === name)).not.toBeUndefined()
				}
			}
			done()
		})
	})
	describe("It should return if conversion formats are supported", () => {
		const isInFormats = jest.fn(async (format: string) => {
			const targetFormat = format
			const formats = await capabilityService.getAvailableFormats()
			return formats.find(format => format.name === targetFormat) !== undefined
		})
		it("It should return true for: mp3", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("mp3")
			expect(isContained).toBe(true)
			done()
		})
		it("It should return true for: mp4", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("mp4")
			expect(isContained).toBe(true)
			done()
		})
		it("It should return true for: m4a", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("m4a")
			expect(isContained).toBe(true)
			done()
		})
		it("It should return true for: webm", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("webm")
			expect(isContained).toBe(true)
			done()
		})
		it("It should return true for: ogg", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("ogg")
			expect(isContained).toBe(true)
			done()
		})
		it("It should return true for: dvd", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("dvd")
			expect(isContained).toBe(true)
			done()
		})
		it("It should return false for: php", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("php")
			expect(isContained).toBe(false)
			done()
		})
		it("It should return false for: jpg", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("jpg")
			expect(isContained).toBe(false)
			done()
		})
		it("It should return false for: <empty>", async (done: jest.DoneCallback) => {
			const isContained = await isInFormats("")
			expect(isContained).toBe(false)
			done()
		})
	})
	describe("It should return if conversion between two given formats is possible", () => {
		const supportsConversion = jest.fn(async (source, target) => {
			const supportsConversion: boolean = await capabilityService.supportsConversion(
				source, target
			)
			return supportsConversion
		})
		it("It should be able to convert FROM mp3 TO mp4", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("mp3", "mp4")
			expect(supports).toBe(true)
			done()
		})
		it("It should be able to convert FROM wav TO mp4", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("wav", "mp4")
			expect(supports).toBe(true)
			done()
		})
		it("It should be able to convert FROM avi TO mp4", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("avi", "mp4")
			expect(supports).toBe(true)
			done()
		})
		it("It should be able to convert FROM dvd TO mp4", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("dvd", "mp4")
			expect(supports).toBe(true)
			done()
		})
		it("It should not be able to convert FROM dvd TO <empty>", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("dvd", "")
			expect(supports).toBe(false)
			done()
		})
		it("It should not be able to convert FROM <empty> TO <empty>", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("", "")
			expect(supports).toBe(false)
			done()
		})
		it("It should not be able to convert FROM jpg TO mp3", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("jpg", "mp3")
			expect(supports).toBe(false)
			done()
		})
		it("It should not be able to convert FROM jpg TO mp4", async (done: jest.DoneCallback) => {
			const supports: boolean = await supportsConversion("pdf", "mp4")
			expect(supports).toBe(false)
			done()
		})
	})
})