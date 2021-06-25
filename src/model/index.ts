export interface IConversionRequestBody {
	file: Buffer,
	filename: string,
	originalFormat: string,
	targetFormat: string
}
export interface IConversionResultFile {
	file?: Buffer,
	filename: string
}