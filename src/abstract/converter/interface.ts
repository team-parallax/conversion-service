import { EConversionStatus } from "Service/conversion/enum"
import {
	TConversionFormats,
	TConversionOptions
} from "./types"
export interface IApiConversionRequest {
	file: Buffer,
	options?: TConversionOptions,
	originalFormat?: string,
	targetFormat: string
}
export interface IConversionBase {
	conversionId: string
}
export interface IConversionRequest extends IConversionBase {
	sourceFormat: string,
	targetFormat: string
}
export interface IConversionFile extends IConversionRequest {
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
export interface IApiConversionFormatResponse {
	document: TConversionFormats
}