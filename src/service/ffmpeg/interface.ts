// #region Review
export interface IConvertedFile extends IConversionResult {
	// TODO: review if this is sufficient for usecase.
	outputFilename: string,
	resultFile?: Buffer
}
export interface IConversionResult{
	outputFilepath: string
}
export interface IConversionParams {
	// TODO: review if this is sufficient for usecase.
	conversionId: string,
	filePath: string,
	outputFilename?: string,
	targetFormat: string
}
export interface IOptions {
	encoder: unknown[],
	filter: unknown[]
}
// #endregion
// #region Capabilities
/* Generic Capabilities Object for FFmpeg */
export interface IFFmpegCapabilities {
	codecs: ICodec[],
	encoders: IEncoder[],
	filters: IFilter[],
	formats: IFormat[]
}
/**
 * Returns all available codecs that can be used with FFmpeg.
 *
 * @tsoaModel
 * @example
 * {
 *  "mp3": {
 *    "type": "audio",
 *    "description": "(decoders: mp3float mp3 ) (encoders: libmp3lame )",
 *    "canDecode": true,
 *    "canEncode": true,
 *    "intraFrameOnly": true,
 *    "isLossy": true,
 *    "isLossless": false
 *  },
 *  "libmp3lame": {
 *    "type": "audio",
 *    "description": "(decoders: mp3float mp3 ) (encoders: libmp3lame )",
 *    "intraFrameOnly": true,
 *    "isLossy": true,
 *    "isLossless": false,
 *    "canEncode": true
 *  }
 * }
 */
export interface IFFmpegCapabilitiesObject<T> {
	[key: string]: T
}
/* FFmpeg interfaces for internal data structures */
export interface IFormat extends IFormatData {
	name: string
}
export interface IFormatData {
	canDemux: boolean,
	canMux: boolean,
	description: string
}
export type TCapabilities = ICodec | IFilter | IFormat | IEncoder
export type TCapabilitiesData = ICodecData | IFilterData | IFormatData | IEncoderData
/**
 * @tsoaModel
 * @example
 * {
 *   "type": "audio",
 *   "description": "(decoders: mp3float mp3 ) (encoders: libmp3lame )",
 *   "canDecode": true,
 *   "canEncode": true,
 *   "intraFrameOnly": true,
 *   "isLossy": true,
 *   "isLossless": false,
 *   "name": "mp3"
 * }
 */
export interface ICodec extends ICodecData {
	name: string
}
export interface ICodecData {
	canDecode: boolean,
	canEncode: boolean,
	description: string,
	directRendering?: boolean,
	drawHorizBand?: boolean,
	intraFrameOnly?: boolean,
	isLossless?: boolean,
	isLossy?: boolean,
	type: string,
	weirdFrameTruncation?: boolean
}
export interface IEncoder extends IEncoderData {
	name: string
}
export interface IEncoderData {
	description: string,
	directRendering: boolean,
	drawHorizBand: boolean,
	experimental: boolean,
	frameMT: boolean,
	sliceMT: boolean,
	type: string
}
export interface IFilter extends IFilterData {
	name: string
}
export interface IFilterData {
	description: string,
	input: string,
	multipleInputs: boolean,
	multipleOutputs: boolean,
	output: string
}
// #endregion