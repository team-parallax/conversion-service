import { FFmpegWrapper } from "../ffmpeg"
import {
	ICodec,
	IEncoder,
	IFFmpegCapabilities,
	IFFmpegCapabilitiesObject,
	IFfmpegFormat,
	IFilter
} from "../ffmpeg/interface"
import { Inject } from "typescript-ioc"
import {
	TCapabilities,
	TCapabilitiesData
} from "../ffmpeg/types"
export class CapabilityService {
	@Inject
	private readonly ffmpegWrapper!: FFmpegWrapper
	public containsCapability<T extends TCapabilities>(
		capabilities: T[], capability: string
	): boolean {
		return capabilities.find(cap => cap.name === capability) !== undefined
	}
	async getAllCapabilities(): Promise<IFFmpegCapabilities> {
		const codecs = await this.getAvailableCodecs()
		const encoders = await this.getAvailableEncoders()
		const formats = await this.getAvailableFormats()
		const filters = await this.getAvailableFilters()
		return {
			codecs,
			encoders,
			filters,
			formats
		}
	}
	async getAvailableCodecs(): Promise<ICodec[]> {
		const data = await this.ffmpegWrapper.getAvailableCodecs()
		return this.nameCapability<ICodec>(data)
	}
	async getAvailableEncoders(): Promise<IEncoder[]> {
		const data = await this.ffmpegWrapper.getAvailableEncoders()
		return this.nameCapability<IEncoder>(data)
	}
	async getAvailableFilters(): Promise<IFilter[]> {
		const data = await this.ffmpegWrapper.getAvailableFilters()
		return this.nameCapability<IFilter>(data)
	}
	async getAvailableFormats(): Promise<IFfmpegFormat[]> {
		const data = await this.ffmpegWrapper.getAvailableFormats()
		return this.nameCapability<IFfmpegFormat>(data)
	}
	public nameCapability<T extends TCapabilities>(
		data: IFFmpegCapabilitiesObject<TCapabilitiesData>
	): T[] {
		const namedData = []
		for (const key in data) {
			if (data.hasOwnProperty(key)) {
				const currentItem = data[key]
				const namedElement: T = {
					...currentItem as T,
					name: key
				}
				namedData.push(namedElement)
			}
		}
		return namedData as unknown as T[]
	}
	async supportsConversion(from: string, to: string): Promise<boolean> {
		const formats = await this.getAvailableFormats()
		const supportsFrom = this.containsCapability<IFfmpegFormat>(formats, from)
		const supportsTo = this.containsCapability<IFfmpegFormat>(formats, to)
		return supportsFrom && supportsTo
	}
}