import { BaseConverter } from "../../abstract/converter"
import { IConversionFile } from "../../abstract/converter/interface"
import { ImageMagick } from "./imagemagick"
import { InvalidPathError } from "../../constants"
import {
	TConversionFormats,
	TConversionRequestFormatSummary
} from "../../abstract/converter/types"
export class ImageMagickWrapper extends BaseConverter {
	public static canConvert = async (
		{
			sourceFormat,
			targetFormat
		}: TConversionRequestFormatSummary
	): Promise<boolean> => {
		const canConvertSource = await ImageMagickWrapper.isSupportedFormat(sourceFormat)
		const canConvertTarget = await ImageMagickWrapper.isSupportedFormat(targetFormat)
		return canConvertSource && canConvertTarget
	}
	public static convertToTarget = async (
		conversionRequest: IConversionFile
	): Promise<IConversionFile> => {
		const {
			path,
			sourceFormat,
			targetFormat
		} = conversionRequest
		const targetPath = path.replace(
			"input",
			"output"
		).replace(
			sourceFormat,
			targetFormat
		)
		const outPath = await ImageMagick.convert(path, targetPath)
		return {
			...conversionRequest,
			path: outPath
		}
	}
	public static getSupportedConversionFormats = async (): Promise<TConversionFormats> => {
		const formats = await ImageMagick.getSupportedConversionFormats()
		return await new Promise((resolve, reject) => {
			if (!formats) {
				throw new InvalidPathError(
					"No formats file detected for image-magick"
				)
			}
			resolve(formats as TConversionFormats)
		})
	}
	public static isSupportedFormat = async (conversionFormat: string): Promise<boolean> => {
		const formats = await ImageMagickWrapper.getSupportedConversionFormats()
		return formats.find(
			format => format.extension === conversionFormat
		) !== undefined
	}
}