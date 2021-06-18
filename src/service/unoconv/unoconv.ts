import "lodash"
import {
	ConversionError, ConversionTimeoutError, maxAllowedConversionTime
} from "../../constants"
import { IFileFormat, IFormatList } from "./interface"
import { execFile, spawn } from "child_process"
import { executeShellCommand } from "../../util"
import { getType } from "mime"
interface IUnoconvOptions {
	port?: string,
	unoconvBinaryPath?: string
}
export type TUnoconvOptions = IUnoconvOptions
export class Unoconv {
	public static readonly defaultBin = "unoconv"
	public static addOptions(
		options?: TUnoconvOptions,
		unoconvArguments: string[] = []
	): string[] {
		if (options?.port) {
			unoconvArguments.push(`-p ${options.port}`)
		}
		return unoconvArguments
	}
	public static async convert(
		filepath: string,
		outputFormat: string,
		options?: TUnoconvOptions
	): Promise<Buffer> {
		const binary = options?.unoconvBinaryPath ?? this.defaultBin
		const stderr: Buffer[] = []
		const stdout: Buffer[] = []
		const unoconvArguments = this.addOptions(options, [
			"-f",
			outputFormat,
			"--stdout"
		])
		unoconvArguments.push(filepath)
		const unoconvProcess = spawn(binary, unoconvArguments)
		unoconvProcess.stdout.on("data", data => stdout.push(data))
		unoconvProcess.stderr.on("data", data => stderr.push(data))
		/* Failsafe mechanism */
		const conversionProcessPromise = new Promise<Buffer>((resolve, reject) => {
			unoconvProcess.on("exit", () => {
				if (stderr.length > 0) {
					reject(new ConversionError(Buffer.concat(stderr).toString()))
				}
				resolve(Buffer.concat(stdout))
			})
		})
		const timeoutPromise = new Promise<Buffer>((resolve, reject) => {
			const maxTime = maxAllowedConversionTime
			setTimeout(
				reject,
				maxTime,
				new ConversionTimeoutError("Conversion timeout exceeded!", unoconvProcess.pid)
			)
		})
		try {
			return await Promise.race([timeoutPromise, conversionProcessPromise])
		}
		catch (error) {
			if (error instanceof ConversionTimeoutError) {
				try {
					const pid = unoconvProcess.pid
					await executeShellCommand(`kill -9 ${pid}`)
					throw new ConversionError(error.message)
				}
				catch (err) {
					throw new ConversionError(err.message)
				}
			}
			throw new ConversionError(error.message)
		}
	}
	public static async detectSupportedFormats(
		options?: TUnoconvOptions
	): Promise<IFormatList> {
		const binary = this.getBinary(options)
		const args = this.addOptions(undefined, ["--show"])
		const detectedFormats: IFormatList = {
			document: [],
			graphics: [],
			presentation: [],
			spreadsheet: []
		}
		let docType: string = ""
		return new Promise((resolve, reject) => {
			execFile(binary, args, (err, stdout, stderr) => {
				if (err) {
					return reject(err)
				}
				// For some reason --show outputs to stderr instead of stdout
				const lines = stderr.split("\n")
				lines.forEach((line: string) => {
					if (line === "The following list of document formats are currently available:") {
						docType = "document"
					}
					else if (line === "The following list of graphics formats are currently available:") {
						docType = "graphics"
					}
					else if (line === "The following list of presentation formats are currently available:") {
						docType = "presentation"
					}
					else if (line === "The following list of spreadsheet formats are currently available:") {
						docType = "spreadsheet"
					}
					else {
						const {
							description,
							extension,
							format
						} = this.handleFormatsLine(line)
						if (description && extension && format) {
							detectedFormats[docType].push({
								description,
								extension,
								format,
								mime: getType(extension)
							})
						}
					}
				})
				if (!this.hasSufficientFormatsDetected(detectedFormats)) {
					return reject(new Error("Unable to detect supported formats"))
				}
				return resolve(detectedFormats)
			})
		})
	}
	public static getBinary(options?: TUnoconvOptions): string {
		return options?.unoconvBinaryPath ?? this.defaultBin
	}
	public static handleFormatsLine(line: string): Partial<IFileFormat> {
		const formatMatch = line.match(/^(.*)-/)
		let format: string | undefined = undefined
		if (formatMatch) {
			const formatMatchResult = formatMatch[1].trim()
			format = this.returnMatchResultString(formatMatchResult)
		}
		const extMatch = line.match(/\[(.*)\]/)
		let extension: string | undefined = undefined
		if (extMatch) {
			const extensionMatchResult = extMatch[1].trim().replace(".", "")
			extension = this.returnMatchResultString(extensionMatchResult)
		}
		const descriptionMatch = line.match(/-(.*)\[/)
		let description: string | undefined = undefined
		if (descriptionMatch) {
			const matchResult = descriptionMatch[1].trim()
			description = this.returnMatchResultString(matchResult)
		}
		const result: Partial<IFileFormat> = {
			description,
			extension,
			format
		}
		return result
	}
	public static hasSufficientFormatsDetected(detectedFormats: IFormatList): boolean {
		const {
			document,
			graphics,
			presentation,
			spreadsheet
		} = detectedFormats
		const hasNoElements = (inputList: unknown[]): boolean => inputList.length < 1
		return !(
			hasNoElements(document)
			&& hasNoElements(graphics)
			&& hasNoElements(presentation)
			&& hasNoElements(spreadsheet)
		)
	}
	public static listen(options?: TUnoconvOptions): unknown {
		const args = this.addOptions(options, ["--listener"])
		const binary = options?.unoconvBinaryPath ?? this.defaultBin
		return spawn(binary, args)
	}
	private static returnMatchResultString(input: string): string | undefined {
		return input.length > 0
			? input
			: undefined
	}
}