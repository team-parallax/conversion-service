import {
	IConversionFile,
	IConversionRequest,
	IConversionStatus
} from "../../../abstract/converter/interface"
export type TConversionRequests = IConversionRequest[]
export type TConversionFiles = IConversionFile[]
export type TConversionIdToStatusMap = Map<string, Omit<IConversionStatus, "conversionId">>