import { BaseConverter } from "../../abstract/converter"
import { IConversionFile } from "../../abstract/converter/interface"
import { ImageMagick } from "./imagemagick"
import { InvalidPathError } from "../../constants"
import { TConversionFormats, TConversionRequestFormatSummary } from "../../abstract/converter/types"
export class ImageMagickWrapper extends BaseConverter {
	canConvert = async (
		{
			sourceFormat,
			targetFormat
		}: TConversionRequestFormatSummary
	): Promise<boolean> => {
		const canConvertSource = await this.isSupportedFormat(sourceFormat)
		const canConvertTarget = await this.isSupportedFormat(targetFormat)
		return canConvertSource && canConvertTarget
	}
	convertToTarget = async (conversionRequest: IConversionFile): Promise<IConversionFile> => {
		const {
			path,
			sourceFormat,
			targetFormat
		} = conversionRequest
		const targetPath = path.replace(sourceFormat, targetFormat)
		const outPath = await ImageMagick.convert(path, targetPath)
		return {
			...conversionRequest,
			path: outPath
		}
	}
	getSupportedConversionFormats = async (): Promise<TConversionFormats> => {
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
	isSupportedFormat = async (conversionFormat: string): Promise<boolean> => {
		const formats = await this.getSupportedConversionFormats()
		return formats.find(
			format => format.extension === conversionFormat
		) !== undefined
	}
}