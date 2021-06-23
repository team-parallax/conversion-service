import { CommandNotFoundError } from "../constants"
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