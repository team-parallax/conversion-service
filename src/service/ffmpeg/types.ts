import {
	ICodec,
	ICodecData,
	IEncoder,
	IEncoderData,
	IFfmpegFormat,
	IFilter,
	IFilterData,
	IFormatData
} from "./interface"
export type TCapabilities = ICodec
	| IFilter
	| IFfmpegFormat
	| IEncoder
export type TCapabilitiesData = ICodecData
	| IFilterData
	| IFormatData
	| IEncoderData