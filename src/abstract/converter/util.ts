import { getType } from "mime"
export const isMediaFile = (fileExtension: string): boolean => {
	const isAudio = getType(fileExtension)?.startsWith("audio/") ?? false
	const isVideo = getType(fileExtension)?.startsWith("video/") ?? false
	return isAudio || isVideo
}