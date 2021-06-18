import { EConfigurationKey } from "./enum"
export class ConfigurationCreationError extends Error {
	readonly name: string
	constructor(message?: string, origin?: string) {
		super(
			`origin of error: ${origin ?? "unknown"}\n${message}`
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
export class MissingWrapperDefinitionError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "MissingWrapperDefinitionError"
	}
}
export class MissingConfigurationValueError extends Error {
	readonly name: string
	constructor(missingConfigurationField: EConfigurationKey) {
		const message = `Missing value for ${missingConfigurationField} in your configuration file`
		super(message)
		this.name = "MissingConfigurationValueError"
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