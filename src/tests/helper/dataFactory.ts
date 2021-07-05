import { IConversionFile } from "../../abstract/converter/interface"
import { TConversionFiles } from "../../service/conversion/queue/types"
import faker from "faker"
const maxNumber = 100
export const createConversionRequests = (sampleSize: number = 1): TConversionFiles => {
	const sample: TConversionFiles = []
	while (sampleSize > 0) {
		sample.push(createConversionRequestDummy())
		// eslint-disable-next-line no-param-reassign
		sampleSize--
	}
	return sample
}
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