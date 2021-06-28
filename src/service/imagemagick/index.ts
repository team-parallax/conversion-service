import { BaseConverter } from "../../abstract/converter"
import {
	IConversionFile,
	IConversionRequest,
	IFormat
} from "../../abstract/converter/interface"
import { ImageMagick } from "./imagemagick"
export class ImageMagickWrapper extends BaseConverter {
	canConvert = async (
		{
			sourceFormat,
			targetFormat
		}: Pick<IConversionRequest, "sourceFormat" | "targetFormat">
	): Promise<boolean> => {
		return await new Promise((resolve, reject) => resolve(false))
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
	getSupportedConversionFormats = async (): Promise<IFormat[]> => {
		return await new Promise((resolve, reject) => resolve([]))
	}
}