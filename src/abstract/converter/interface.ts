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
export interface IConversionFileProps {
	fileName: string,
	filePath: string
}
export interface IConversionStatus extends IConversionFile {
	status: EConversionStatus
}
export interface IFormat {
	description: string,
	extension: string
}
export interface IApiCompatResponseV1 extends IConversionStatus {
	failures: number,
	resultFile: Buffer
}
export interface IApiConversionFormatResponse {
	document: TConversionFormats
}
export type TApiConvertedCompatResponseV1 = IApiCompatResponseV1