import { IConversionFile, IConversionFileProps } from "../../abstract/converter/interface"
import { IConversionRequestBody } from "./interface"
import { basePath } from "../../constants"
import { v4 as uuidV4 } from "uuid"
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