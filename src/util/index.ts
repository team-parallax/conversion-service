import {
	CommandNotFoundError,
	EMaxValue,
	maxAllowedConversionTimeFallback,
	maxAllowedConversionTriesFallback
} from "../constants"
import { exec } from "child_process"
export const executeShellCommand = async (command: string): Promise<string> => {
	return await new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				if (error.message.includes("not found")) {
					reject(new CommandNotFoundError("Command could not be found."))
				}
				reject(error)
			}
			else if (stderr) {
				reject(stderr)
			}
			resolve(stdout)
		})
	})
}
export const getMaxAllowedConversionValues = (value: EMaxValue): number => {
	const maxValueString = process.env[value]
	const maxValue = Number(maxValueString)
	// Happens if maxValueString is undefined
	if (isNaN(maxValue)) {
		switch (value) {
			case EMaxValue.conversionTime:
				return maxAllowedConversionTimeFallback
			case EMaxValue.tries:
			default:
				// TODO: refactor this according to new config loading
				// Throw new MissingConfigurationValueError(`Unknown error with input: ${value}`)
				return maxAllowedConversionTriesFallback
		}
	}
	else {
		return maxValue
	}
}