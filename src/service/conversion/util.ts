import {
	DifferentOriginalFormatsDetectedError, EHttpResponseCodes, basePath
} from "../../constants"
import { IConversionFile, IConversionFileProps } from "../../abstract/converter/interface"
import { IConversionRequestBody, IUnsupportedConversionFormatError } from "./interface"
import { v4 as uuidV4 } from "uuid"
import express from "express"
import multer from "multer"
export const transformRequestBodyToConversionFile = (
	{
		originalFormat,
		targetFormat
	}: IConversionRequestBody
): IConversionFile => {
	const conversionId = uuidV4()
	const path = `input/${conversionId}.${originalFormat}`
	return {
		conversionId,
		path,
		retries: 0,
		sourceFormat: originalFormat as string,
		targetFormat
	}
}
export const getConvertedFileNameAndPath = (
	conversionId: string,
	targetFormat: string
): IConversionFileProps => {
	const fileName = `${conversionId}.${targetFormat}`
	const filePath = `${basePath}output/${fileName}`
	return {
		fileName,
		filePath
	}
}
/**
	 * Error handler that handles different errors and stes the response code accordingly
	 * @param error The error to handle.
	 * @returns an formatted error message
	 */
export const handleError = (error: Error): IUnsupportedConversionFormatError => {
	if (error instanceof DifferentOriginalFormatsDetectedError) {
		return {
			errorCode: EHttpResponseCodes.badRequest,
			message: error.message
		}
	}
	else {
		return {
			errorCode: EHttpResponseCodes.internalServerError,
			message: error.message
		}
	}
}
/**
 * Handles file-uploads with multipart/formData requests.
 */
export const handleMultipartFormData = async (
	request: express.Request
): Promise<IConversionRequestBody> => {
	const multerSingle = multer().single("conversionFile")
	return new Promise((resolve, reject) => {
		multerSingle(request, express.response, (error: unknown) => {
			if (error) {
				reject(error)
			}
			const {
				originalFormat,
				targetFormat
			} = request?.body
			const {
				file
			} = request
			resolve({
				file: file.buffer,
				filename: file.originalname,
				originalFormat,
				targetFormat
			})
		})
	})
}