import { ConversionError } from "../../constants"
import { EConfigurationKey } from "../../enum"
import { IFileFormat, IFormatList } from "../../service/unoconv/interface"
import { TConversionRequestFormatSummary } from "../../abstract/converter/types"
import { TUnoconvOptions } from "../../service/unoconv/unoconv"
import { UnoconvWrapper } from "../../service/unoconv"
import { getType } from "mime"
import { Unoconv as unoconv } from "../../service/unoconv/unoconv"
describe("Unoconv-Wrapper should pass all tests", () => {
	describe("It should return the correct value for binary", () => {
		it("should return the default binary value, because no options argument is passed", () => {
			/* Arrange */
			const defaultBinary = unoconv.defaultBin
			/* Act */
			const receivedBinary: string = unoconv.getBinary()
			/* Assert */
			expect(receivedBinary).toBe(defaultBinary)
		})
		it("should return the default binary value, because no unoconv path is given in options", () => {
			/* Arrange */
			const defaultBinary = unoconv.defaultBin
			const options: TUnoconvOptions = {
				port: "12"
			}
			/* Act */
			const receivedBinary: string = unoconv.getBinary(options)
			/* Assert */
			expect(receivedBinary).toBe(defaultBinary)
		})
		it("should return the binary value from passed options", () => {
			/* Arrange */
			const optionsBinary = "/usr/bin/unoconv"
			const options: TUnoconvOptions = {
				unoconvBinaryPath: optionsBinary
			}
			/* Act */
			const receivedBinary: string = unoconv.getBinary(options)
			/* Assert */
			expect(receivedBinary).toBe(optionsBinary)
		})
		it("should return the binary value from passed sophisticated options", () => {
			/* Arrange */
			const optionsBinary = "/usr/bin/unoconv"
			const options: TUnoconvOptions = {
				port: "1234",
				unoconvBinaryPath: optionsBinary
			}
			/* Act */
			const receivedBinary: string = unoconv.getBinary(options)
			/* Assert */
			expect(receivedBinary).toBe(optionsBinary)
		})
	})
	describe("It should handle all unoconv output lines correctly", () => {
		it("should return a Partial<T> with all properties set to undefined, because of empty line.", () => {
			/* Arrange */
			const formatLine = ""
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: undefined,
				extension: undefined,
				format: undefined
			})
		})
		it("should return a Partial<T> with all properties set correctly (sdc).", () => {
			/* Arrange */
			const formatLine = "sdc      - StarCalc 5.0 [.sdc]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: "StarCalc 5.0",
				extension: "sdc",
				format: "sdc"
			})
		})
		it("should return a Partial<T> with all properties set correctly (xhtml).", () => {
			/* Arrange */
			const formatLine = "xhtml - XHTML [.xhtml]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: "XHTML",
				extension: "xhtml",
				format: "xhtml"
			})
		})
		it("should return a Partial<T> with all properties set correctly (ppt).", () => {
			/* Arrange */
			const formatLine = "ppt- Microsoft PowerPoint 97/2000/XP [.ppt]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: "Microsoft PowerPoint 97/2000/XP",
				extension: "ppt",
				format: "ppt"
			})
		})
		it("should return a Partial<T> with all properties set correctly (docx).", () => {
			/* Arrange */
			const formatLine = "docx     - Microsoft Office Open XML [.docx]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: "Microsoft Office Open XML",
				extension: "docx",
				format: "docx"
			})
		})
		it("should return a Partial<T> with particalur properties set", () => {
			/* Arrange */
			const formatLine = "docx-  [.docx]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: undefined,
				extension: "docx",
				format: "docx"
			})
		})
		it("should return a Partial<T> with only extension property set", () => {
			/* Arrange */
			const formatLine = "docx  [.docx]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: undefined,
				extension: "docx",
				format: undefined
			})
		})
		it("should return a Partial<T> with only extension property unset", () => {
			/* Arrange */
			const formatLine = "docx- Microsoft Office Open XML []"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: "Microsoft Office Open XML",
				extension: undefined,
				format: "docx"
			})
		})
		it("should return a Partial<T> with extension property unset", () => {
			/* Arrange */
			const formatLine = "docx- Microsoft Office Open XML [.]"
			/* Act */
			const partialFileFormat: Partial<IFileFormat> = unoconv.handleFormatsLine(formatLine)
			/* Assert */
			expect<Partial<IFileFormat>>(partialFileFormat).toEqual({
				description: "Microsoft Office Open XML",
				extension: undefined,
				format: "docx"
			})
		})
	})
	describe("It should add options correctly", () => {
		it("Argument list equals initial state because no options are passed", () => {
			/* Arrange */
			const initialArguments: string[] = []
			/* Act */
			const updatedArguments: string[] = unoconv.addOptions(undefined, initialArguments)
			/* Assert */
			expect(updatedArguments).toEqual(initialArguments)
		})
		it("Argument list equals initial state because options do not include port", () => {
			/* Arrange */
			const options: TUnoconvOptions = {
				unoconvBinaryPath: "some/path"
			}
			const initialArguments: string[] = []
			/* Act */
			const updatedArguments: string[] = unoconv.addOptions(options, initialArguments)
			/* Assert */
			expect(updatedArguments).toEqual(initialArguments)
		})
		it("Updated argument list should only include port", () => {
			/* Arrange */
			const options: TUnoconvOptions = {
				port: "22",
				unoconvBinaryPath: "some/path"
			}
			const initialArguments: string[] = []
			/* Act */
			const updatedArguments: string[] = unoconv.addOptions(options, initialArguments)
			/* Assert */
			expect(updatedArguments).toEqual([`-p ${options.port}`])
		})
		it("Updated argument list should include port and given previous arguments", () => {
			/* Arrange */
			const options: TUnoconvOptions = {
				port: "22",
				unoconvBinaryPath: "some/path"
			}
			const initialArguments: string[] = ["arg1", "arg2"]
			/* Act */
			const updatedArguments: string[] = unoconv.addOptions(options, [...initialArguments])
			/* Assert */
			expect(updatedArguments).toEqual([...initialArguments, `-p ${options.port}`])
		})
		it("Updated argument list should on contain port option, given no arguments", () => {
			const options: TUnoconvOptions = {
				port: "1234"
			}
			const updatedArguments = unoconv.addOptions(options)
			expect(updatedArguments).toEqual([`-p ${options.port}`])
		})
	})
	describe("It should check if format detection works correctly", () => {
		it("no formats detected", () => {
			const formats: IFormatList = {
				document: [],
				graphics: [],
				presentation: [],
				spreadsheet: []
			}
			const hasFormats = unoconv.hasSufficientFormatsDetected(formats)
			expect(hasFormats).toBe(false)
		})
		it("formats detected with documents", () => {
			const formats: IFormatList = {
				document: [
					{
						description: "example",
						extension: "pdf",
						format: "pdf",
						mime: getType("pdf") ?? "application/pdf"
					},
					{
						description: "MediaWiki",
						extension: "txt",
						format: "mediawiki",
						mime: "text/plain"
					},
					{
						description: "ODF Text Document",
						extension: "odt",
						format: "odt",
						mime: "application/vnd.oasis.opendocument.text"
					}
				],
				graphics: [
					{
						description: "Joint Photographic Experts Group",
						extension: "jpg",
						format: "jpg",
						mime: "image/jpeg"
					}
				],
				presentation: [
					{
						description: "Microsoft PowerPoint 2007/2010 XML",
						extension: "pptx",
						format: "pptx",
						mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
					}
				],
				spreadsheet: [
					{
						description: "Microsoft Excel 97/2000/XP",
						extension: "xls",
						format: "xls",
						mime: "application/vnd.ms-excel"
					}
				]
			}
			const hasFormats = unoconv.hasSufficientFormatsDetected(formats)
			expect(hasFormats).toBe(true)
		})
	})
	describe("It should perform all asynchronous tasks correctly", () => {
		const maxTime = 30000
		jest.setTimeout(maxTime)
		const setEnvVars = (): void => {
			process.env[`${EConfigurationKey.maxConversionTime}`] = "90000"
			process.env[`${EConfigurationKey.maxConversionTries}`] = "5"
		}
		it("should return all supported formats", async () => {
			/* Arrange */
			setEnvVars()
			const formats = unoconv.detectSupportedFormats()
			const isIformatList = (object: unknown): object is IFormatList => {
				const {
					document, graphics, presentation, spreadsheet
				} = object as IFormatList
				if (document && graphics && presentation && spreadsheet) {
					return true
				}
				return false
			}
			const formatListCandidate = await formats
			/* Assert */
			await expect(formats).resolves.toBeDefined()
			expect(isIformatList(formatListCandidate)).toBe(true)
		})
		it("should return a buffer with converted file", async done => {
			/* Arrange */
			const filePath = "./sample-input/documents/sample.rtf"
			const targetFormat = "pdf"
			/* Act */
			const res = unoconv.convert(filePath, targetFormat)
			/* Assert */
			await expect(res).resolves.toBeDefined()
			await expect(res).resolves.toBeInstanceOf(Buffer)
			done()
		})
		it("should throw a conversion error for a malicious document", async () => {
			/* Arrange */
			const filePath = "./sample-input/documents/freezingDoc.docx"
			const targetFormat = "pdf"
			/* Act */
			setEnvVars()
			const res = unoconv.convert(filePath, targetFormat)
			/* Assert */
			await expect(res).rejects.toBeInstanceOf(ConversionError)
		})
	})
	describe("It should return true if conversion between formats is possible", () => {
		it("should return true for html-->pdf conversion", async () => {
			/* Arrange */
			const testFormats = [
				{
					sourceFormat: "html",
					targetFormat: "pdf"
				},
				{
					sourceFormat: "docx",
					targetFormat: "pdf"
				},
				{
					sourceFormat: "pptx",
					targetFormat: "html"
				}
			]
			const results: Promise<boolean>[] = []
			/* Act */
			const isConvertable = jest.fn(async (formats: TConversionRequestFormatSummary) => {
				return await UnoconvWrapper.canConvert(formats)
			})
			for (const formatObject of testFormats) {
				results.push(isConvertable(formatObject))
			}
			const resolvedResults = await Promise.all(results)
			const canConvertAll = !resolvedResults.includes(false)
			/* Assert */
			expect(canConvertAll).toBe(true)
		})
	})
})