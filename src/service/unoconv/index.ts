import { BaseConverter } from "../../abstract/converter"
import {
	ConversionError,
	NoPathForConversionError,
	NoTargetFormatSpecifiedError
} from "../../constants"
import {
	IConversionFile, IConversionRequest, IFormat
} from "../../abstract/converter/interface"
import { IFileFormat } from "./interface"
import { Logger } from "../logger"
import { Unoconv as unoconv } from "./unoconv"
import { writeToFile } from "../file-io"
export class UnoconvWrapper extends BaseConverter {
	private static readonly logger: Logger = new Logger()
	public static async canConvert({
		fromFormat: inputFormat,
		targetFormat: outputFormat
	}: IConversionRequest): Promise<boolean> {
		const supportedFormats = await this.getSupportedConversionFormats()
		const canConvertInputFormat = Boolean(supportedFormats.find(
			format => format.extension === inputFormat
		))
		const canConvertOutputFormat = Boolean(supportedFormats.find(
			format => format.extension === outputFormat
		))
		return canConvertInputFormat && canConvertOutputFormat
	}
	public static async convertToTarget(
		conversionRequest: IConversionFile
	): Promise<IConversionFile> {
		const {
			conversionId,
			path: filePath,
			targetFormat
		} = conversionRequest
		const outputFilename: string = conversionId
		if (!filePath?.length) {
			throw new NoPathForConversionError("No Path for file to convert provided.")
		}
		if (!targetFormat?.length) {
			throw new NoTargetFormatSpecifiedError("No target format specified.")
		}
		try {
			const conversion = await unoconv.convert(filePath, targetFormat)
			const path = `./out/${conversionId}.${targetFormat}`
			this.logger.log(`Successfully converted file. Saving to disk`)
			await writeToFile(path, conversion)
			return {
				...conversionRequest,
				path
			}
		}
		catch (err) {
			throw new ConversionError(err.message)
		}
	}
	public static async getSupportedConversionFormats(): Promise<IFormat[]> {
		const {
			document,
			graphics,
			presentation,
			spreadsheet
		} = await unoconv.detectSupportedFormats()
		return [
			...document,
			...graphics,
			...presentation,
			...spreadsheet
		].map(
			unoconvSupportedFormat => {
				return this.transformUnoconvFormatToIFormat(unoconvSupportedFormat)
			}
		)
	}
	private static transformUnoconvFormatToIFormat(
		unoconvSupportedFormat: IFileFormat
	): IFormat {
		const {
			description, extension
		} = unoconvSupportedFormat
		return {
			description,
			extension
		}
	}
}