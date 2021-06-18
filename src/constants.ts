import { getMaxAllowedConversionValues } from "./util"
import path from "path"
export enum EHttpResponseCodes {
    ok = 200,
    created = 201,
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
export const basePath: string = path.join(__dirname, "../")
export const maxAllowedConversionTimeFallback: number = 120000
export const maxAllowedConversionTime: number = getMaxAllowedConversionValues(
	EMaxValue.conversionTime
)
export const maxAllowedConversionTriesFallback: number = 5
export const maxAllowedConversionTries: number = getMaxAllowedConversionValues(
	EMaxValue.tries
)
export class CommandNotFoundError extends Error {
	readonly name: string
	constructor(message: string) {
		super(message)
		this.name = "CommandNotFoundError"
	}
}
export class ConversionError extends Error {
	readonly name: string
	constructor(message: string) {
		super(message)
		this.name = "ConversionError"
	}
}
export class ConversionTimeoutError extends ConversionError {
	readonly conversionProcessId: number
	readonly name: string
	constructor(message: string, convPid?: number) {
		super(message)
		this.name = "ConversionTimeoutError"
		this.conversionProcessId = convPid ?? -1
	}
}
export class DifferentOriginalFormatsDetectedError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "DifferentOriginalFormatsDetectedError"
	}
}
export class InvalidPathError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "InvalidPathError"
	}
}
export class NoTargetFormatSpecifiedError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoTargetFormatSpecifiedError"
	}
}
export class NoPathForConversionError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoPathForConversionError"
	}
}
export class NoSuchConversionIdError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "NoSuchConversionIdError"
	}
}
export class UnsupportedConversionFormatError extends Error {
	readonly name: string
	constructor(message: string | undefined) {
		super(message)
		this.name = "UnsupportedConversionFormatError"
	}
}