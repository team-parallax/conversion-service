import { EConversionStatus } from "Service/conversion/enum"
export interface IApiConversionRequest {
	file: Buffer,
	targetFormat: string
}
export interface IConversionRequest extends IConversionBase {
	fromFormat: string,
	targetFormat: string
}
export interface IConversionBase {
	conversionId: string
}
export interface IConversionFile extends IConversionRequest {
	failures: number,
	path: string,
	retries: number
}
export interface IConversionStatus extends IConversionFile {
	status: EConversionStatus
}
export interface IFormat {
	description: string,
	extension: string
}