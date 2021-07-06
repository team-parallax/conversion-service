import {
	EConversionRuleType,
	EConversionWrapper
} from "../enum"
import {
	TConversionWrapperEnums,
	TConversionWrappers
} from "./type"
export interface IConfig {
	conversionMaximaConfiguration: IConversionMaximaConfig,
	conversionWrapperConfiguration: IConversionWrapperConfig,
	webservicePort: number
}
export interface IConversionRule {
	rule: string,
	ruleType: EConversionRuleType
}
export interface IConversionWrapperConfig {
	availableWrappers: TConversionWrappers,
	precedenceOrder: IConversionPrecedenceOrder
}
export interface IConversionWrapper {
	binary: EConversionWrapper,
	path: string
}
export interface IConversionMaximaConfig {
	conversionTime: number,
	conversionTries: number
}
export interface IConversionPrecedenceOrder {
	document: TConversionWrapperEnums,
	media: TConversionWrapperEnums
}