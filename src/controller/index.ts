import {
	Controller,
	Example,
	Get,
	Route,
	Tags
} from "tsoa"
import { ConversionService } from "../service/conversion"
import { EHttpResponseCodes } from "../constants"
import { IApiConversionFormatResponse } from "../abstract/converter/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../service/logger"
@Route("/")
export class IndexController extends Controller {
	@Inject
	private readonly conversionService!: ConversionService
	@Inject
	private readonly logger!: Logger
	@Tags("Misc.")
	@Get("/ping")
	@Example<string>("pong")
	public getPingResponse(): string {
		this.logger.log("Received 'ping' signal.")
		this.setStatus(EHttpResponseCodes.ok)
		return "pong"
	}
	@Tags("Conversion-Formats")
	@Get("/formats")
	public async getSupportedConversionFormats(): Promise<IApiConversionFormatResponse> {
		this.logger.log("Conversion formats requested")
		return await this.conversionService.getSupportedConversionFormats()
	}
}