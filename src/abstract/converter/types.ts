import { IConversionRequest, IFormat } from "./interface"
import { IFfmpegOptions } from "../../service/ffmpeg/interface"
export type TConversionOptions = IFfmpegOptions
export type TConversionFormats = IFormat[]
export type TConversionRequestFormatSummary = Pick<IConversionRequest, "sourceFormat" | "targetFormat">
export type TConversionRequestFormats = TConversionRequestFormatSummary[]