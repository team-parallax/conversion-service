import { BaseConverter } from "../abstract/converter"
import {
	ConfigurationCreationError,
	InvalidConfigurationSpecError,
	MissingConfigurationValueError,
	MissingWrapperDefinitionError,
	UnknownConversionRuleFormatError,
	UnknownConversionWrapperError
} from "./exception"
import {
	EConfigurationKey, EConversionRuleType, EConversionWrapper
} from "../enum"
import { FFmpegWrapper } from "../service/ffmpeg"
import {
	IConfig,
	IConversionMaximaConfig,
	IConversionPrecedenceOrder,
	IConversionRule,
	IConversionWrapper,
	IConversionWrapperConfig
} from "./interface"
import { TConversionRulesConfig } from "./type"
import { UnoconvWrapper } from "../service/unoconv"
import { config as envConfig } from "dotenv"
envConfig()
export const initializeConversionWrapperMap = (
	availableWrappers: EConversionWrapper[]
): Map<EConversionWrapper, BaseConverter> => {
	const converterMap = new Map<EConversionWrapper, BaseConverter>()
	for (const wrapperName of availableWrappers) {
		switch (wrapperName) {
			case EConversionWrapper.ffmpeg:
				converterMap.set(wrapperName, FFmpegWrapper as BaseConverter)
				break
			case EConversionWrapper.unoconv:
				converterMap.set(wrapperName, UnoconvWrapper as BaseConverter)
				break
			default:
				if (wrapperName === EConversionWrapper.imagemagick) {
					throw new UnknownConversionWrapperError(`${wrapperName} is not yet implemented`)
				}
				throw new UnknownConversionWrapperError(wrapperName)
		}
	}
	return converterMap
}
export const createConfiguration = (): IConfig => {
	try {
		const conversionMaximaConfiguration = createMaximaConfiguration()
		const conversionWrapperConfiguration = createWrapperConfiguration()
		const conversionRules = {
			mono: [],
			multi: []
		}
		const webservicePort = getPortConfigValue()
		return {
			conversionMaximaConfiguration,
			conversionWrapperConfiguration,
			rules: conversionRules,
			webservicePort
		}
	}
	catch (error) {
		/* This error is only thrown when it's impossible to create a configuration */
		if (error instanceof ConfigurationCreationError) {
			throw error
		}
		else {
			/**
			 * TODO: Handle errors thrown: check if error source is critical
			 * or if thrown error could be handled otherwise
			 * Eventually throw ConfigurationCreationError here.
			 */
			if (error instanceof MissingConfigurationValueError) {
				throw new ConfigurationCreationError(
					error.message,
					`createConfiguration has caught: ${error.name}`
				)
			}
			else {
				throw Error(error.message)
			}
		}
	}
}
export const createConversionPrecedenceOrderConfig = (): IConversionPrecedenceOrder => {
	try {
		const documentPrecedenceOrderString = loadValueFromEnv(
			EConfigurationKey.converterDocumentPriority
		)
		if (!documentPrecedenceOrderString) {
			throw new MissingConfigurationValueError(EConfigurationKey.converterDocumentPriority)
		}
		const documentPrecedenceOrder: EConversionWrapper[] = transformStringToWrapperCollection(
			documentPrecedenceOrderString
		)
		const mediaPrecedenceOrderString = loadValueFromEnv(
			EConfigurationKey.converterMediaPriority
		)
		if (!mediaPrecedenceOrderString) {
			throw new MissingConfigurationValueError(EConfigurationKey.converterMediaPriority)
		}
		const mediaPrecedenceOrder: EConversionWrapper[] = transformStringToWrapperCollection(
			mediaPrecedenceOrderString
		)
		return {
			document: documentPrecedenceOrder,
			media: mediaPrecedenceOrder
		}
	}
	catch (error) {
		if (error instanceof MissingConfigurationValueError) {
			throw new MissingWrapperDefinitionError(
				`Missing definition for wrapper precedence:\n\n${error?.message ?? "No error-message set"}`
			)
		}
		else {
			/* Just pass the error as is */
			throw error
		}
	}
}
export const createConversionRulesConfiguration = (): TConversionRulesConfig => {
	return {
		mono: [],
		multi: []
	}
}
export const createConversionRule = (ruleKey: string): IConversionRule | undefined => {
	try {
		if (ruleKey === "") {
			throw new InvalidConfigurationSpecError("<empty-key>")
		}
		const ruleType: EConversionRuleType = getRuleShape(ruleKey)
		const rule: string | undefined = loadValueFromEnv(ruleKey)
		if (!rule) {
			throw new InvalidConfigurationSpecError("<empty-value>")
		}
		return {
			rule,
			ruleType
		}
	}
	catch (error) {
		if (error instanceof UnknownConversionRuleFormatError) {
			return undefined
		}
		throw error
	}
}
export const getRuleShape = (ruleString: string): EConversionRuleType => {
	const monoPattern: RegExp = /(CONVERT_TO_[A-Za-z0-9]*_WITH)/
	const multiPattern: RegExp = /(CONVERT_FROM_[A-Za-z0-9]*_TO_[A-Za-z0-9]*_WITH)/
	if (ruleString.search(multiPattern) !== -1) {
		return EConversionRuleType.multi
	}
	else if (ruleString.search(monoPattern) !== -1) {
		return EConversionRuleType.mono
	}
	throw new UnknownConversionRuleFormatError(ruleString)
}
export const createMaximaConfiguration = (): IConversionMaximaConfig => {
	const maxConversionTime = loadValueFromEnv(
		EConfigurationKey.maxConversionTime
	) ?? loadValueFromEnv(`${EConfigurationKey.maxConversionTime}_DEFAULT`)
	if (!maxConversionTime) {
		throw new MissingConfigurationValueError(EConfigurationKey.maxConversionTime)
	}
	const maxConversionTries = loadValueFromEnv(
		EConfigurationKey.maxConversionTries
	) ?? loadValueFromEnv(`${EConfigurationKey.maxConversionTries}_DEFAULT`)
	if (!maxConversionTries) {
		throw new MissingConfigurationValueError(EConfigurationKey.maxConversionTries)
	}
	return {
		conversionTime: Number(maxConversionTime),
		conversionTries: Number(maxConversionTries)
	}
}
export const createWrapperConfiguration = (): IConversionWrapperConfig => {
	try {
		const precedenceOrder: IConversionPrecedenceOrder = createConversionPrecedenceOrderConfig()
		const availableWrappersAsEnum: EConversionWrapper[] = [
			...new Set([
				...precedenceOrder.document,
				...precedenceOrder.media
			])
		]
		const errors: Error[] = []
		const availableWrappers: IConversionWrapper[] = []
		for (const wrapper of availableWrappersAsEnum) {
			try {
				const transformedWrapper = transformEnumToIWrapper(wrapper)
				availableWrappers.push(transformedWrapper)
			}
			catch (error) {
				if (error instanceof MissingConfigurationValueError) {
					errors.push(error)
					continue
				}
				throw error
			}
		}
		if (errors.length > 0) {
			if (errors.length === availableWrappersAsEnum.length) {
				throw new ConfigurationCreationError(
					"Unable to create a configuration for available wrappers:\n\n"
					+ "Either no data was provided or it could not be parsed correctly",
					`Origin of error:\n\n\tcreateWrapperConfiguration`
				)
			}
			else if (availableWrappers === []) {
				throw new ConfigurationCreationError(
					"Unable to create a configuration for available wrappers:\n\n"
					+ "Either no data was provided or it could not be parsed correctly",
					`Origin of error:\n\n\tcreateWrapperConfiguration`
				)
			}
		}
		return {
			availableWrappers,
			precedenceOrder
		}
	}
	catch (error) {
		if (error instanceof MissingWrapperDefinitionError) {
			throw new ConfigurationCreationError(
				`An unexpected error during the initialization of the configuration occurred:\n\n${
					error.message
				}`,
				"Wrapper-Configuration Creation"
			)
		}
		else {
			throw error
		}
	}
}
export const getPortConfigValue = (): number => {
	const webservicePort = loadValueFromEnv(EConfigurationKey.webservicePort)
	const webservicePortDefault = loadValueFromEnv(
		`${EConfigurationKey.webservicePort}_DEFAULT`
	)
	if (!webservicePort) {
		if (!webservicePortDefault) {
			throw new MissingConfigurationValueError(
				EConfigurationKey.webservicePort
			)
		}
		return Number(webservicePortDefault)
	}
	return Number(webservicePort)
}
export const loadValueFromEnv = (variableKey: string): string | undefined => {
	return process.env?.[variableKey]
}
export const transformEnumToIWrapper = (
	wrapperEnumValue: EConversionWrapper
): IConversionWrapper => {
	const wrapperPathConfigKey: EConfigurationKey = getWrapperPathConfigKeyFromEnum(
		wrapperEnumValue
	)
	const wrapperPath: string | undefined = loadValueFromEnv(wrapperPathConfigKey)
	if (!wrapperPath) {
		throw new MissingConfigurationValueError(wrapperPathConfigKey)
	}
	return {
		binary: wrapperEnumValue,
		path: wrapperPath
	}
}
export const getWrapperPathConfigKeyFromEnum = (
	wrapperEnumValue: EConversionWrapper
): EConfigurationKey => {
	switch (wrapperEnumValue) {
		case EConversionWrapper.ffmpeg:
			return EConfigurationKey.ffmpegPath
		case EConversionWrapper.imagemagick:
			return EConfigurationKey.imageMagickPath
		case EConversionWrapper.unoconv:
		default:
			return EConfigurationKey.unoconvPath
	}
}
export const transformStringToWrapperCollection = (
	wrapperString: string,
	splitDelimiterString: string = ","
): EConversionWrapper[] => {
	return wrapperString
		.split(splitDelimiterString)
		.map(
			converterCandidate => {
				// Ignore word-casing
				const conversionWrapperName = converterCandidate.trim()
					.toLowerCase()
				if (!Object.keys(EConversionWrapper)
					.includes(conversionWrapperName)) {
					throw new UnknownConversionWrapperError(conversionWrapperName)
				}
				return EConversionWrapper[
					conversionWrapperName
				]
			}
		)
}
const config: IConfig = createConfiguration()
// eslint-disable-next-line import/no-default-export
export default config