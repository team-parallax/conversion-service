import {
	ConfigurationCreationError,
	MissingConfigurationValueError,
	MissingWrapperDefinitionError,
	UnknownConversionWrapperError
} from "./exception"
import { EConfigurationKey, EConversionWrapper } from "./enum"
import {
	IConfig,
	IConversionMaximaConfig,
	IConversionPrecedenceOrder,
	IConversionWrapper,
	IConversionWrapperConfig
} from "./interface"
import { config } from "dotenv"
config()
export const createConfiguration = (): IConfig => {
	// TODO: Add more tests
	try {
		const conversionMaximaConfiguration = createMaximaConfiguration()
		const conversionWrapperConfiguration = createWrapperConfiguration()
		return {
			conversionMaximaConfiguration,
			conversionWrapperConfiguration
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
			 * TODO: Eventually throw ConfigurationCreationError here.
			 */
			if (error instanceof MissingConfigurationValueError) {
				throw new ConfigurationCreationError(
					error.message,
					"createConfiguration"
				)
			}
			throw Error("Unknown Error")
		}
	}
}
export const createConversionPrecedenceOrderConfig = (): IConversionPrecedenceOrder => {
	/* TODO: Add test-cases for this function */
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
export const createMaximaConfiguration = (): IConversionMaximaConfig => {
	/* TODO: Add test-cases for this function */
	const maxConversionTime = loadValueFromEnv(EConfigurationKey.maxConversionTime)
	if (!maxConversionTime) {
		throw new MissingConfigurationValueError(EConfigurationKey.maxConversionTime)
	}
	const maxConversionTries = loadValueFromEnv(EConfigurationKey.maxConversionTries)
	if (!maxConversionTries) {
		throw new MissingConfigurationValueError(EConfigurationKey.maxConversionTries)
	}
	return {
		conversionTime: Number(maxConversionTime),
		conversionTries: Number(maxConversionTries)
	}
}
export const loadValueFromEnv = (variableKey: string): string | undefined => {
	return process.env?.[variableKey]
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
		const availableWrappers: IConversionWrapper[] = availableWrappersAsEnum.map(
			conversionWrapperEnumValue => transformEnumToIWrapper(
				conversionWrapperEnumValue
			)
		)
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
export const transformEnumToIWrapper = (
	wrapperEnumValue: EConversionWrapper
): IConversionWrapper => {
	// TODO: add tests
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
const getWrapperPathConfigKeyFromEnum = (
	wrapperEnumValue: EConversionWrapper
): EConfigurationKey => {
	switch (wrapperEnumValue) {
		case EConversionWrapper.ffmpeg:
			return EConfigurationKey.ffmpegPath
		case EConversionWrapper.imagemagick:
			return EConfigurationKey.imageMagick
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