export interface IFileFormat {
	description: string,
	extension: string,
	format: string,
	mime: string
}
/**
 * @tsoaModel
 * @example
 * {
 *	"document": [
 *		{
 *			"format": "mediawiki",
 *			"extension": "txt",
 *			"description": "MediaWiki",
 *			"mime": "text/plain"
 *		},
 *		{
 *			"format": "odt",
 *			"extension": "odt",
 *			"description": "ODF Text Document",
 *			"mime": "application/vnd.oasis.opendocument.text"
 *		}
 *	],
 *	"graphics": [
 *		{
 *			"format": "jpg",
 *			"extension": "jpg",
 *			"description": "Joint Photographic Experts Group",
 *			"mime": "image/jpeg"
 *		},
 *		{
 *			"format": "png",
 *			"extension": "png",
 *			"description": "Portable Network Graphic",
 *			"mime": "image/png"
 *		}
 *	],
 *	"presentation": [
 *		{
 *			"format": "odp",
 *			"extension": "odp",
 *			"description": "ODF Presentation",
 *			"mime": "application/vnd.oasis.opendocument.presentation"
 *		},
 *		{
 *			"format": "pptx",
 *			"extension": "pptx",
 *			"description": "Microsoft PowerPoint 2007/2010 XML",
 *			"mime": "application/vnd.openxmlformats-officedocument.presentationml.presentation"
 *		}
 *	],
 *	"spreadsheet": [
 *		{
 *			"format": "ods",
 *			"extension": "ods",
 *			"description": "ODF Spreadsheet",
 *			"mime": "application/vnd.oasis.opendocument.spreadsheet"
 *		},
 *		{
 *			"format": "xls",
 *			"extension": "xls",
 *			"description": "Microsoft Excel 97/2000/XP",
 *			"mime": "application/vnd.ms-excel"
 *		}
 *	]
 * }
 */
export interface IFormatList {
	document: IFileFormat[],
	graphics: IFileFormat[],
	presentation: IFileFormat[],
	spreadsheet: IFileFormat[]
}
export interface IConvertedFile {
	outputFilename: string,
	path: string
}
export interface IConversionParams {
	conversionId: string,
	filePath: string,
	outputFilename?: string,
	targetFormat: string
}