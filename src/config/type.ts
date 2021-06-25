import { EConversionRuleType } from "~/enum"
import { IConversionRule } from "./interface"
export type TConversionRulesConfig = {
	[key in EConversionRuleType]: IConversionRule[]
}