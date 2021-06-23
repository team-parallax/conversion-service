import { EConversionRuleType, EConversionWrapper } from "../enum"
export interface IConfig {
	conversionMaximaConfiguration: IConversionMaximaConfig,
	conversionWrapperConfiguration: IConversionWrapperConfig,
	rules?: IConversionRulesConfig,
	webservicePort: number
}
export interface IConversionRulesConfig {
	[key: string]: IConversionRule[]
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