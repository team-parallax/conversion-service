export enum EConversionWrapper {
	ffmpeg = "ffmpeg",
	imagemagick = "imagemagick",
	unoconv = "unoconv"
}
export enum EConfigurationKey {
	converterDocumentPriority = "CONVERTER_DOCUMENT_PRIORITY",
	converterMediaPriority = "CONVERTER_MEDIA_PRIORITY",
	ffmpegPath = "FFMPEG_PATH",
	imageMagick = "IMAGE_MAGICK_PATH",
	maxConversionTime = "MAX_CONVERSION_TIME",
	maxConversionTries = "MAX_CONVERSION_TRIES",
	unoconvPath = "UNOCONV_PATH",
}