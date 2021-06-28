import * as gm from "gm"
import { TResizeOptions } from "./types"
import { resolve } from "path"
const imagemagick = gm.subClass({
	imageMagick: true
})
export class ImageMagick {
	public static convert = async (
		sourcePath: string,
		targetPath: string,
		resizeOptions?: TResizeOptions
	): Promise<string> => {
		const inPath = resolve(sourcePath)
		const outPath = resolve(targetPath)
		const conversion = imagemagick(
			inPath
		)
		return await ImageMagick.writeOutput(
			conversion,
			outPath
		)
	}
	public static writeOutput = async (
		conversionFile: gm.State,
		targetPath: string
	): Promise<string> => await new Promise(
		(resolve, reject) => {
			conversionFile.write(targetPath, error => {
				if (error) {
					reject(error)
				}
				resolve(targetPath)
			})
		}
	)
}