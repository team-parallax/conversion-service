import { IConversionFile } from "../../abstract/converter/interface"
import { TConversionFiles } from "../../service/conversion/queue/types"
import faker from "faker"
export const createConversionRequests = (sampleSize: number = 1): TConversionFiles => {
	const sample: TConversionFiles = []
	while (sampleSize > 0) {
		sample.push(createConversionRequestDummy())
		// eslint-disable-next-line no-param-reassign
		sampleSize--
	}
	return sample
}
const createConversionRequestDummy = (): IConversionFile => {
	const maxNumber = 100
	const sourceFormat = faker.system.fileExt("audio/ogg")
	const targetFormat = faker.system.fileExt("audio/mp4")
	return {
		conversionId: faker.datatype.uuid(),
		path: faker.system.filePath(),
		retries: faker.datatype.number(maxNumber),
		sourceFormat,
		targetFormat
	}
}
export const getRandomNumber = (maximum: number): number => {
	return faker.datatype.number(maximum)
}