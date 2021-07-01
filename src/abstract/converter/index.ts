import {
	IConversionFile,
	IConversionRequest,
	IFormat
} from "./interface"
import { TConversionOptions } from "./types"
export abstract class BaseConverter {
	public canConvert = async ({
		sourceFormat,
		targetFormat
	}: Pick<IConversionRequest, "sourceFormat" | "targetFormat">): Promise<boolean> => {
		return await new Promise((resolve, reject) => resolve(false))
	}
	public convertToTarget = async (
		conversionRequest: IConversionFile,
		conversionOptions?: TConversionOptions
	): Promise<IConversionFile> => {
		return new Promise((resolve, reject) => {
			reject("Not implemented")
		})
	}
	public getSupportedConversionFormats = async (): Promise<IFormat[]> => new Promise(
		(resolve, reject) => resolve([])
	)
}