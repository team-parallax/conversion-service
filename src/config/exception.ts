import { EConfigurationKey } from "../enum"
export class ConfigurationCreationError extends Error {
	readonly name: string
	constructor(message?: string, origin?: string) {
		super(
			`\nOrigin of error:\n${origin ?? "unknown"}\n\n\t${message}`
			?? "Error during config creation"
		)
		this.name = "ConfigurationCreationError"
	}
}
export class InvalidConfigurationError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "InvalidConfigurationError"
	}
}
export class InvalidConfigurationSpecError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "InvalidConfigurationSpecError"
	}
}
export class MissingWrapperDefinitionError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "MissingWrapperDefinitionError"
	}
}
export class MissingConfigurationValueError extends Error {
	readonly missingField: EConfigurationKey
	readonly name: string
	constructor(missingConfigurationField: EConfigurationKey) {
		const message = `Missing value for ${missingConfigurationField} in your configuration file`
		super(message)
		this.missingField = missingConfigurationField
		this.name = "MissingConfigurationValueError"
	}
}
export class UnknownConversionRuleFormatError extends Error {
	constructor(conversionRule: string) {
		const message = `The provided rule '${conversionRule}' is unknown.\nIgnored in the following`
		super(message)
		this.name = "UnknownConversionRuleFormatError"
	}
}
export class UnknownConversionWrapperError extends Error {
	static readonly errorName: string = "UnknownConversionWrapperError"
	constructor(unknownConversionWrapper: string) {
		super(
			UnknownConversionWrapperError.message(
				UnknownConversionWrapperError.errorName,
				unknownConversionWrapper
			)
		)
	}
	private static readonly message = (
		name: string,
		unknownConversionWrapper: string
	): string => `[${name}] Unknown Conversion wrapper: ${unknownConversionWrapper}`
}