import path from "path"
export enum EHttpResponseCodes {
    ok = 200,
    created = 201,
	redirect = 302,
    noContent = 204,
    badRequest = 400,
    unauthorized = 401,
    forbidden = 403,
    notFound = 404,
	validationError = 422,
    internalServerError = 500,
    unavailable = 503
}
export enum EMaxValue {
	conversionTime = "MAX_CONVERSION_TIME",
	tries = "MAX_CONVERSION_TRIES"
}
export const maxConversionTimeFallback = 90000
export const maxConversionTriesFallback = 5
export const basePath: string = path.join(__dirname, "../")
export class CommandNotFoundError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "CommandNotFoundError"
	}
}
export class ConversionError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "ConversionError"
	}
}
export class MaxConversionTriesError extends Error {
	readonly name: string
	constructor(conversionId: string, message?: string) {
		const errorMessage = message ?? `Maximum conversion tries reached for ${conversionId}`
		super(errorMessage)
		this.name = "MaxConversionTriesError"
	}
}
export class ConversionTimeoutError extends ConversionError {
	readonly conversionProcessId: number
	readonly name: string
	constructor(message?: string, convPid?: number) {
		super(message)
		this.name = "ConversionTimeoutError"
		this.conversionProcessId = convPid ?? -1
	}
}
export class DifferentOriginalFormatsDetectedError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "DifferentOriginalFormatsDetectedError"
	}
}
export class InvalidRequestBodyError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "InvalidRequestBodyError"
	}
}
export class InvalidPathError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "InvalidPathError"
	}
}
export class NoTargetFormatSpecifiedError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "NoTargetFormatSpecifiedError"
	}
}
export class NoPathForConversionError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "NoPathForConversionError"
	}
}
export class NoSuchConversionIdError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "NoSuchConversionIdError"
	}
}
export class UnsupportedConversionFormatError extends Error {
	readonly name: string
	constructor(message?: string) {
		super(message)
		this.name = "UnsupportedConversionFormatError"
	}
}