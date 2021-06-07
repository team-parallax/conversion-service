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
export const basePath: string = path.join(__dirname, "../")
export class ConversionError extends Error {
	readonly name: string
	constructor(message: string) {
		super(message)
		this.name = "ConversionError"
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