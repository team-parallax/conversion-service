import { EConversionRuleType, EConversionWrapper } from "../enum"
import { TConversionRulesConfig } from "./type"
export interface IConfig {
	conversionMaximaConfiguration: IConversionMaximaConfig,
	conversionWrapperConfiguration: IConversionWrapperConfig,
	rules?: TConversionRulesConfig,
	webservicePort: number
}
export interface IConversionRule {
	rule: string,
	ruleType: EConversionRuleType
}
export interface IConversionWrapperConfig {
	availableWrappers: IConversionWrapper[],
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
	document: EConversionWrapper[],
	media: EConversionWrapper[]
}