import { BaseConverter } from "."
import { ConversionError } from "../../constants"
import { ConversionQueue } from "../../service/conversion/queue"
import {
	EConversionRuleType,
	EConversionWrapper
} from "../../enum"
import {
	IConversionFile,
	IConversionRequest,
	IConversionStatus
} from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { NoAvailableConversionWrapperError } from "../../config/exception"
import { isMediaFile } from "./util"
import config, {
	getRuleStringFromTemplate,
	loadValueFromEnv,
	transformStringToWrapperEnumValue
} from "../../config"
export class ConverterService {
	@Inject
	protected readonly conversionQueue!: ConversionQueue
	protected converterMap: Map<EConversionWrapper, BaseConverter>
	constructor() {
		this.converterMap = new Map()
	}
	public async convert(
		converter: EConversionWrapper,
		file: IConversionFile
	): Promise<IConversionStatus> {
		return await this.converterMap[converter].convertToTarget(file)
	}
	public determineConverter(conversionFormats: IConversionRequest): EConversionWrapper {
		const {
			conversionWrapperConfiguration: {
				precedenceOrder: {
					document,
					media
				}
			}
		} = config
		const isMediaSourceFile = isMediaFile(conversionFormats.sourceFormat)
		const monoRuleWrapper = loadValueFromEnv(
			getRuleStringFromTemplate(conversionFormats, EConversionRuleType.mono)
		)
		const multiRuleWrapper = loadValueFromEnv(
			getRuleStringFromTemplate(conversionFormats, EConversionRuleType.multi)
		)
		if (!(document.length > 0 && media.length > 0)) {
			throw new NoAvailableConversionWrapperError("No wrappers found")
		}
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
	protected async wrapConversion(
		conversionRequest: IConversionFile
	): Promise<IConversionFile> {
		try {
			const converter = this.determineConverter(conversionRequest)
			return await this.convert(converter, conversionRequest)
		}
		catch (error) {
			/* Throw error inside enqueue if max retries are reached */
			const {
				retries
			} = conversionRequest
			this.conversionQueue.addToConversionQueue(conversionRequest, retries + 1)
			throw new ConversionError("Error during conversion")
		}
	}
}