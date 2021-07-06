import {
	IConversionFile,
	IConversionRequest,
	IConversionStatus
} from "../../../abstract/converter/interface"
export type TBaselessConversionFile = Omit<IConversionStatus, "conversionId">
export type TConversionRequests = IConversionRequest[]
export type TConversionFiles = IConversionFile[]
export type TConversionIdToConversionFileMap = Map<string, TBaselessConversionFile>
export type TNullableConversionFile = IConversionFile | null