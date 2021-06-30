import { BaseConverter } from "."
import { ConversionError } from "../../constants"
import { ConversionQueue } from "../../service/conversion/queue"
import { EConversionWrapper } from "../../enum"
import {
	IConversionFile,
	IConversionRequest,
	IConversionStatus
} from "../../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import config from "~/config"
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
	public determineConverter({
		sourceFormat,
		targetFormat
	}: IConversionRequest): EConversionWrapper {
		const {
			conversionWrapperConfiguration
		} = config
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
			/* Throw error inside enqueue if max retries are reached */
			const {
				retries
			} = conversionRequest
			this.conversionQueue.addToConversionQueue(conversionRequest, retries + 1)
			throw new ConversionError("Error during conversion")
		}
	}
}