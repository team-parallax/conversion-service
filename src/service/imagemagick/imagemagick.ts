import * as gm from "gm"
import { TConversionFormats } from "../../abstract/converter/types"
import { TImageResizeOptions } from "./types"
import { formats } from "./image-magick-formats.json"
import { resolve } from "path"
const imagemagick = gm.subClass({
	imageMagick: true
})
export class ImageMagick {
	public static convert = async (
		sourcePath: string,
		targetPath: string,
		resizeOptions?: TImageResizeOptions
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
	public static getSupportedConversionFormats = async (): Promise<TConversionFormats> => {
		return await new Promise(
			(resolve, reject) => {
				resolve(formats as TConversionFormats)
			}
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