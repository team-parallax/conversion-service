import * as gm from "gm"
import { TResizeOptions } from "./types"
const imagemagick = gm.subClass({
	imageMagick: true
})
export class ImageMagick {
	public static convert = async (
		sourcePath: string,
		targetPath: string,
		resizeOptions?: TResizeOptions
	): Promise<string> => {
		const conversion = imagemagick(sourcePath)
		return await ImageMagick.writeOutput(
			conversion,
			targetPath
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