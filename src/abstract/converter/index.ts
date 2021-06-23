import {
	IConversionFile, IConversionRequest, IFormat
} from "./interface"
export abstract class BaseConverter {
	public async canConvert(conversionRequest: IConversionRequest): Promise<boolean> {
		const supportedFormats = await this.getSupportedConversionFormats()
		return false
	}
	public convertToTarget = async (
		conversionRequest: IConversionFile
	): Promise<IConversionFile> => {
		return new Promise((resolve, reject) => {
			reject("Not implemented")
		})
	}
	public getSupportedConversionFormats = async (): Promise<IFormat[]> => new Promise(
		(resolve, reject) => resolve([])
	)
}