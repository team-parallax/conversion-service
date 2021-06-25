import { BaseConverter } from "../../abstract/converter"
import { CapabilityService } from "../capabilities"
import {
	ICodecData,
	IEncoderData,
	IFFmpegCapabilitiesObject,
	IFilterData,
	IFormatData
} from "./interface"
import {
	IConversionFile, IConversionRequest, IFormat
} from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../logger"
import { TConversionOptions } from "../../abstract/converter/types"
import { basePath } from "../../constants"
import { join } from "path"
import Ffmpeg, { FfmpegCommand } from "fluent-ffmpeg"
export class FFmpegWrapper extends BaseConverter {
	@Inject
	private readonly logger!: Logger
	public static canConvert = async (
		{
			sourceFormat,
			targetFormat
		}: Pick<IConversionRequest, "sourceFormat" | "targetFormat">
	): Promise<boolean> => {
		return await new CapabilityService().supportsConversion(sourceFormat, targetFormat)
	}
	public static convertToTarget = async (
		{
			path,
			sourceFormat,
			targetFormat,
			retries,
			conversionId
		}: IConversionFile,
		conversionOptions?: TConversionOptions
	): Promise<IConversionFile> => {
		return await new Promise((resolve, reject) => {
			try {
				const delay = 2000
				const inputFile = join(basePath, path)
				const outPath = join(basePath, "output")
				const outputFile = `${outPath}/${conversionId}.${targetFormat}`
				const ffmpegCommand: FfmpegCommand = Ffmpeg(inputFile)
					.format(targetFormat)
				if (conversionOptions?.filter) {
					ffmpegCommand.addOptions(conversionOptions?.filter as string[])
				}
				if (conversionOptions?.encoder) {
					ffmpegCommand.addOptions(conversionOptions?.encoder as string[])
				}
				ffmpegCommand.save(outputFile).run()
				setTimeout(
					() =>
						resolve({
							conversionId,
							path: outputFile,
							retries,
							sourceFormat,
							targetFormat
						}),
					delay
				)
			}
			catch (err) {
				reject(`FROM WITHIN CONVERSION${err}`)
			}
		})
	}
	public static getSupportedConversionFormats = async (): Promise<IFormat[]> => {
		const formats = await new CapabilityService().getAvailableFormats()
		return formats.map(ffmpegFormat => ({
			description: ffmpegFormat.description,
			extension: ffmpegFormat.name
		}))
	}
	async getAvailableCodecs(): Promise<IFFmpegCapabilitiesObject<ICodecData>> {
		return await new Promise((resolve, reject) => {
			Ffmpeg.getAvailableCodecs(
				(err: Error, codecs: IFFmpegCapabilitiesObject<ICodecData>) => {
					if (err) {
						reject(err)
					}
					resolve(codecs)
				}
			)
		})
	}
	async getAvailableEncoders(): Promise<IFFmpegCapabilitiesObject<IEncoderData>> {
		return await new Promise((resolve, reject) => {
			Ffmpeg.getAvailableEncoders(
				(err: Error, encoders: IFFmpegCapabilitiesObject<IEncoderData>) => {
					if (err) {
						reject(err)
					}
					resolve(encoders)
				}
			)
		})
	}
	async getAvailableFilters(): Promise<IFFmpegCapabilitiesObject<IFilterData>> {
		return await new Promise((resolve, reject) => {
			Ffmpeg.getAvailableFilters(
				(err: Error, filters: IFFmpegCapabilitiesObject<IFilterData>) => {
					if (err) {
						reject(err)
					}
					resolve(filters)
				}
			)
		})
	}
	async getAvailableFormats(): Promise<IFFmpegCapabilitiesObject<IFormatData>> {
		return await new Promise((resolve, reject) => {
			Ffmpeg.getAvailableFormats(
				(err: Error, formats: IFFmpegCapabilitiesObject<IFormatData>) => {
					if (err) {
						reject(err)
					}
					resolve(formats)
				}
			)
		})
	}
}