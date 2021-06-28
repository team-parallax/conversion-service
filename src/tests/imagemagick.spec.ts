import { ImageMagick } from "../service/imagemagick/imagemagick"
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
	it.todo("should throw an error if parent dir of file-targetPath does not exist")
})