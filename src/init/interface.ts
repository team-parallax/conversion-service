import { EConversionWrapper } from "./enum"
export interface IConfig {
	conversionMaximaConfiguration: IConversionMaximaConfig,
	conversionWrapperConfiguration: IConversionWrapperConfig,
	rules?: IConversionRulesConfig
}
export interface IConversionRulesConfig {
	/* TODO: maybe this could also be resolved with an enum or mapped type */
	[key: string]: string | string[]
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