import { IConversionRequest } from "~/service/conversion/interface"
import faker from "faker"
export const createConversionRequests = (sampleSize: number = 1): IConversionRequest[] => {
	const sample: IConversionRequest[] = []
	while (sampleSize > 0) {
		sample.push(createConversionRequestDummy())
		// eslint-disable-next-line no-param-reassign
		sampleSize--
	}
	return sample
}
const createConversionRequestDummy = (): IConversionRequest => {
	const sourceFormat = faker.system.fileExt("audio/ogg")
	const targetFormat = faker.system.fileExt("audio/mp4")
	return {
		conversionId: faker.datatype.uuid(),
		isConverted: false,
		name: faker.system.fileName(),
		path: faker.system.filePath(),
		sourceFormat,
		targetFormat
	}
}