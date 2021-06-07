import { EConversionStatus } from "./enum"
export interface IError {
	message: string
}
export interface IUnsupportedConversionFormatError extends IError {}
export interface IConvertable {
	conversionId: string
}
export interface IConversionStatus extends IConvertable {
	status: EConversionStatus
}
export interface IConversionInQueue extends IConversionStatus {
	queuePosition: number
}
export interface IConversionInProgress extends IConversionStatus {}
export interface IConversionFinished extends IConversionStatus {
	resultFilePath: string
}
/**
 * @tsoaModel
 * @example
 * {
 * 	"conversionId": "55309c37-aed3-4ee9-a143-f1e305333189"
 * }
 */
export interface IConversionProcessingResponse {
	conversionId: string
}
/**
 * @tsoaModel
 * @example
 * {
 *	"conversions": [
 *		{
 *			"conversionId": "55309c37-aed3-4ee9-a143-f1e305333189",
 *			"status": "converted"
 *		},
 *		{
 *			"conversionId": "52a22c37-aed3-4ee9-a442-f1e30537v189",
 *			"status": "processing"
 *		},
 *		{
 *			"conversionId": "940403bf-98ad-454c-a3b4-2e6ebf915ac6",
 * 			"status": "in queue",
 * 			"queuePosition": 1
 *		}
 *	],
 *	"remainingConversions": 1
 * }
 */
export interface IConversionQueueStatus {
	conversions: IConversionStatus[],
	remainingConversions: number
}
/**
 * @tsoaModel
 * @example
 * {
 *	"file": {
 *		"type":"Buffer",
 *		"data": [
 *			67,111,110,118,
 *			101,114,116,101,
 *			100,32,118,105,
 *			97,32,116,101,
 *			97,109,112,97,
 *			114,97,108,108,
 *			97,120,47,117,
 *			110,111,99,111,
 *			110,118,45,119,
 *			101,98,115,101,
 *			114,118,105,99,
 *			101,10
 *		]
 *	},
 *	"filename": "assignment1",
 *   "originalFormat": "docx",
 *   "targetFormat": "pdf"
 * }
 */
export interface IConversionRequestBody {
	file: Buffer,
	filename: string,
	originalFormat: string,
	targetFormat: string
}
export interface IConversionRequest {
	conversionId: string,
	isConverted: boolean,
	name: string,
	path: string,
	sourceFormat: string,
	targetFormat: string
}
/**
 * @tsoaModel
 * @example
 * {
 *	"message": "converted",
 *	"result": {
 *		"conversionId": "55309c37-aed3-4ee9-a143-f1e305333189",
 *		"name": "testFile",
 *		"path": "./output/55309c37-aed3-4ee9-a143-f1e305333189.pdf",
 *		"resultFile": {
 *			"type":"Buffer",
 *			"data": [
 *				67,111,110,118,
 *				101,114,116,101,
 *				100,32,118,105,
 *				97,32,116,101,
 *				97,109,112,97,
 *				114,97,108,108,
 *				97,120,47,117,
 *				110,111,99,111,
 *				110,118,45,119,
 *				101,98,115,101,
 *				114,118,105,99,
 *				101,10
 *			]
 *		}
 *	}
 * }
 */
export interface IConversionStatusResponse {
	result?: IConversionResult,
	status: string
}
export interface IConversionResult {
	conversionId: string,
	name: string,
	path: string,
	resultFile: Buffer
}