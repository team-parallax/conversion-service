export enum EConversionWrapper {
	ffmpeg = "ffmpeg",
	imagemagick = "imagemagick",
	unoconv = "unoconv"
}
export enum EConversionRuleType {
	/* Rules that follow the pattern CONVERT_FROM_X_TO_Y_WITH */
	binary = "binary",
	/* Rules that follow the pattern CONVERT_FROM_X_WITH */
	unary = "unary"
}
export enum EConfigurationKey {
	converterDocumentPriority = "CONVERTER_DOCUMENT_PRIORITY",
	converterMediaPriority = "CONVERTER_MEDIA_PRIORITY",
	ffmpegPath = "FFMPEG_PATH",
	imageMagickPath = "IMAGE_MAGICK_PATH",
	maxConversionTime = "MAX_CONVERSION_TIME",
	maxConversionTries = "MAX_CONVERSION_TRIES",
	unoconvPath = "UNOCONV_PATH",
	webservicePort = "WEBSERVICE_PORT",
}