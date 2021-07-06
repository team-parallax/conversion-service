import { BaseConverter } from "./index"
import { EConversionWrapper } from "../../enum"
import {
	IConversionRequest,
	IFormat
} from "./interface"
import { IFfmpegOptions } from "../../service/ffmpeg/interface"
export type TConversionOptions = IFfmpegOptions
export type TConversionFormats = IFormat[]
export type TConversionRequestFormatSummary = Pick<IConversionRequest, "sourceFormat" | "targetFormat">
export type TConversionRequestFormats = TConversionRequestFormatSummary[]
export type TConverterMap = Map<EConversionWrapper, BaseConverter>