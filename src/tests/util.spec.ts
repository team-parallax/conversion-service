import { executeShellCommand } from "../util"
describe("It should pass all tests for utility functions", () => {
	it("should execute shell commands without an incident", async () => {
		/* Arrange */
		const command = "ls -ll"
		/* Act */
		const getCommandResponse = async (
			command: string
		): Promise<string> => await executeShellCommand(command)
		/* Assert */
		await expect(getCommandResponse(command)).resolves.not.toThrow()
	})
	it("should propagate the error from the shell", async () => {
		/* Arrange */
		const command = "ls -a /non-existent-folder"
		/* Act */
		/* Assert */
		await expect(executeShellCommand(command)).rejects.toThrow()
	})
})