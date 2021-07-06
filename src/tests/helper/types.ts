import { EConversionStatus } from "../../service/conversion/enum"
import { IConversionBase } from "../../abstract/converter/interface"
export type TConvLogChangeParams = {
	convertedFilePath?: string,
	status: EConversionStatus
} & IConversionBase