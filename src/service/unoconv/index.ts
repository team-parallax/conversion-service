import {
	ConversionError,
	NoPathForConversionError,
	NoTargetFormatSpecifiedError
} from "../../constants"
import {
	IConversionParams,
	IConvertedFile,
	IFormatList
} from "./interface"
import { Logger } from "../logger"
import { Unoconv as unoconv } from "./unoconv"
import { writeToFile } from "../file-io"
export class UnoconvService {
	private static readonly logger: Logger = new Logger()
	public static async convertToTarget(
		conversionRequest: IConversionParams
	): Promise<IConvertedFile> {
		const {
			conversionId,
			filePath,
			outputFilename,
			targetFormat
		} = conversionRequest
		let filename: string = `${outputFilename}-converted`
		if (!outputFilename?.length) {
			filename = conversionId
		}
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
			const result: Omit<IConvertedFile, "resultFile"> = {
				outputFilename: `${filename}.${targetFormat}`,
				path
			}
			return result
		}
		catch (err) {
			throw new ConversionError(err.message)
		}
	}
	public static async showAvailableFormats(): Promise<IFormatList> {
		return await unoconv.detectSupportedFormats()
	}
}