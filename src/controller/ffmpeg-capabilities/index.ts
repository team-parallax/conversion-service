import { CapabilityService } from "../../service/capabilities"
import {
	Controller,
	Get,
	Route,
	Tags
} from "tsoa"
import {
	ICodec,
	IEncoder,
	IFFmpegCapabilities,
	IFilter,
	IFormat
} from "../../service/ffmpeg/interface"
import { Inject } from "typescript-ioc"
import { Logger } from "../../service/logger"
@Route("/capabilities")
@Tags("Capabilities")
export class CapabilityController extends Controller {
	@Inject
	private readonly capabilityService!: CapabilityService
	@Inject
	private readonly logger!: Logger
	/**
	 * Returns a list of capabilities and options that
	 * can be applied to an FFmpeg command.
	 */
	@Get("/")
	public async getAvailableCapabilities(): Promise<IFFmpegCapabilities> {
		this.logger.log(`Ffmpeg-Capabilities requested`)
		return await this.capabilityService.getAllCapabilities()
	}
	@Get("/codecs")
	public async getAvailableCodecs(): Promise<ICodec[]> {
		this.logger.log(`Ffmpeg-Codecs requested`)
		return await this.capabilityService.getAvailableCodecs()
	}
	/**
	 * Returns all available encoders FFmpeg is able to use.
	 */
	@Get("/encoders")
	public async getAvailableEncoders(): Promise<IEncoder[]> {
		this.logger.log(`Ffmpeg-Encoders requested`)
		return await this.capabilityService.getAvailableEncoders()
	}
	/**
	 * Returns all available filters that can be used for conversion.
	 */
	@Get("/filter")
	public async getAvailableFilter(): Promise<IFilter[]> {
		this.logger.log(`Ffmpeg-Filter requested`)
		return await this.capabilityService.getAvailableFilters()
	}
	/**
	 * Returns all available formats that can be converted with FFmpeg.
	 */
	@Get("/formats")
	public async getAvailableFormats(): Promise<IFormat[]> {
		this.logger.log(`Ffmpeg-Formats requested`)
		return await this.capabilityService.getAvailableFormats()
	}
}