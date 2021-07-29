import { EConversionStatus } from "../../service/conversion/enum"
import { IConversionFile } from "../../abstract/converter/interface"
import { IConversionRequestBody } from "../../service/conversion/interface"
import { TConvLogChangeParams } from "./types"
import { TConversionFiles } from "../../service/conversion/queue/types"
import faker from "faker"
const maxNumber = 4
export const createConversionRequests = (sampleSize: number = 1): TConversionFiles => {
	const sample: TConversionFiles = []
	while (sampleSize > 0) {
		sample.push(createConversionRequestDummy())
		// eslint-disable-next-line no-param-reassign
		sampleSize--
	}
	return sample
}
export const createConversionRequestBody = (): IConversionRequestBody => ({
	file: Buffer.from("testbuffer"),
	filename: faker.system.fileName(),
	originalFormat: faker.system.fileExt(),
	targetFormat: faker.system.fileExt()
})
export const createConversionRequestDummy = (
	source?: string,
	target?: string,
	retries: number = faker.datatype.number(maxNumber)
): IConversionFile => {
	const sourceFormat = source ?? faker.system.fileExt("audio/ogg")
	const targetFormat = target ?? faker.system.fileExt("audio/mp4")
	return {
		conversionId: faker.datatype.uuid(),
		path: faker.system.filePath(),
		retries,
		sourceFormat,
		targetFormat
	}
}
export const getRandomNumber = (maximum: number): number => {
	return faker.datatype.number(maximum)
}
export const createChangeConvLogParams = (
	shouldContainPath: boolean = false
): TConvLogChangeParams => {
	const conversionId = faker.datatype.uuid()
	const convLogChangeParams = {
		conversionId,
		status: EConversionStatus.converted
	}
	if (shouldContainPath) {
		return {
			...convLogChangeParams,
			convertedFilePath: faker.system.filePath()
		}
	}
	return convLogChangeParams
}