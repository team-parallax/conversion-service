import { BaseConverter } from "."
import {
	ConversionError,
	MaxConversionTriesError
} from "../../constants"
import { ConversionQueue } from "../../service/conversion/queue"
import {
	EConversionRuleType,
	EConversionWrapper
} from "../../enum"
import { EConversionStatus } from "../../service/conversion/enum"
import { IConversionFile } from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
import { NoAvailableConversionWrapperError } from "../../config/exception"
import {
	TConversionRequestFormatSummary,
	TConverterMap
} from "./types"
import { isMediaFile } from "./util"
import config, {
	getRuleStringFromTemplate,
	loadValueFromEnv,
	transformStringToWrapperEnumValue
} from "../../config"
const {
	conversionTries: maxConversionTries
} = config.conversionMaximaConfiguration
export class ConverterService {
	@Inject
	public readonly conversionQueue!: ConversionQueue
	@Inject
	protected readonly logger!: Logger
	protected converterMap: TConverterMap
	protected maxConversionTries: number
	constructor() {
		this.converterMap = new Map()
		this.maxConversionTries = maxConversionTries
	}
	public async convert(
		converter: EConversionWrapper,
		file: IConversionFile
	): Promise<IConversionFile> {
		const conversionWrapper: BaseConverter = this.converterMap.get(converter) as BaseConverter
		return await conversionWrapper.convertToTarget(file)
	}
	public determineConverter(
		conversionFormats: TConversionRequestFormatSummary
	): EConversionWrapper {
		const {
			conversionWrapperConfiguration: {
				precedenceOrder: {
					document,
					media
				}
			}
		} = config
		if (!(document.length > 0 && media.length > 0)) {
			throw new NoAvailableConversionWrapperError("No wrappers found")
		}
		const isMediaSourceFile = isMediaFile(conversionFormats.sourceFormat)
		const monoRuleWrapper = loadValueFromEnv(
			getRuleStringFromTemplate(conversionFormats, EConversionRuleType.mono)
		)
		const multiRuleWrapper = loadValueFromEnv(
			getRuleStringFromTemplate(conversionFormats, EConversionRuleType.multi)
		)
		if (multiRuleWrapper !== undefined) {
			return transformStringToWrapperEnumValue(multiRuleWrapper)
		}
		else if (monoRuleWrapper !== undefined) {
			return transformStringToWrapperEnumValue(monoRuleWrapper)
		}
		else {
			return isMediaSourceFile
				? media[0]
				: document[0]
		}
	}
	public async wrapConversion(
		conversionRequest: IConversionFile
	): Promise<IConversionFile> {
		const {
			conversionId,
			retries
		} = conversionRequest
		try {
			if (retries >= maxConversionTries) {
				throw new MaxConversionTriesError(conversionId)
			}
			const converter = this.determineConverter(conversionRequest)
			const conversionFile = await this.convert(converter, conversionRequest)
			this.conversionQueue.changeConvLogEntry(
				conversionId,
				EConversionStatus.converted,
				conversionFile.path
			)
			return conversionFile
		}
		catch (error) {
			/* Propagate error to calling function */
			const {
				message,
				name
			} = error
			if (error instanceof MaxConversionTriesError) {
				throw error
			}
			this.logger.error(
				`[ conversion-service ] Re-add the file conversion request due to error before: ${error}`
			)
			this.logger.error(
				`[ conversion-service ] retry value is: ${retries} updated retries: ${retries + 1}`
			)
			this.conversionQueue.addToConversionQueue({
				...conversionRequest,
				retries: retries + 1
			})
			throw new ConversionError(`Error during conversion: ${name} ${message}`)
		}
	}
}