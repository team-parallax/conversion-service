import { FFmpegWrapper } from "../service/ffmpeg"
import { basePath } from "../constants"
import { createDirectoryIfNotPresent } from "../service/file-io"
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
		const conversion = await ffmpeg.convertToTargetFormat(
			"./sample-input/aWholesomeLesson.mp3",
			"ffmConverted",
			"mp3",
			"mp4"
		)
		expect(conversion).toBeDefined()
	})
	it("should convert .mp3 to .mp4 with different path", async () => {
		const conversion = await ffmpeg.convertToTargetFormat(
			"sample-input/aWholesomeLesson.mp3",
			"ffmConvertedToo",
			"mp3",
			"mp4"
		)
		expect(conversion).toBeDefined()
	})
})