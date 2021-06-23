import { BaseConverter } from "."
import { ConversionError } from "../../constants"
import { ConversionQueueService } from "../../service/conversion/conversionQueue"
import { EConversionWrapper } from "../../enum"
import {
	IConversionFile,
	IConversionRequest,
	IConversionStatus
} from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { initializeConversionWrapperMap } from "../../config"
export class ConverterService {
	@Inject
	private readonly queueService!: ConversionQueueService
	private readonly converterMap: Map<EConversionWrapper, BaseConverter>
	constructor() {
		this.converterMap = initializeConversionWrapperMap([])
	}
	public async convert(
		converter: EConversionWrapper,
		file: IConversionFile
	): Promise<IConversionStatus> {
		return await this.converterMap[converter].convertToTarget(file)
	}
	public determineConverter(conversionRequest: IConversionRequest): EConversionWrapper {
		return EConversionWrapper.unoconv
	}
	private async wrapConversion(
		conversionRequest: IConversionFile
	): Promise<IConversionFile> {
		try {
			const converter = this.determineConverter(conversionRequest)
			return await this.convert(converter, conversionRequest)
		}
		catch (error) {
			/* TODO log error */
			/* Throw error inside enqueue if max retries are reached */
			const {
				retries
			} = conversionRequest
			// This.queueService.addToConversionQueue(conversionRequest, retries + 1)
			throw new ConversionError("Error during conversion")
		}
	}
}