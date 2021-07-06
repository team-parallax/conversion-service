import { InvalidPathError, basePath } from "../constants"
import {
	createDirectoryIfNotPresent,
	deleteFile,
	deleteFolderRecursive,
	isDirectory,
	isFile,
	readFromFileSync,
	writeToFile
} from "../service/file-io"
import { existsSync } from "fs"
import { resolve } from "path"
const resolvePath = (path: string): string => resolve(basePath, path)
describe("It should pass all tests for File-IO", () => {
	const inDirectory = "./testing/input"
	const outDirectory = "./testing/out"
	const testDirectory = "./testing/test"
	beforeAll(async (): Promise<void> => {
		if (existsSync(inDirectory)) {
			try {
				deleteFolderRecursive(inDirectory)
			}
			catch (error) {
				console.error(error.message)
			}
		}
		if (existsSync(outDirectory)) {
			try {
				deleteFolderRecursive(outDirectory)
			}
			catch (error) {
				console.error(error.message)
			}
		}
		if (!existsSync(testDirectory)) {
			await createDirectoryIfNotPresent(testDirectory)
		}
	})
	describe("It should determine if given input is a file or directory correctly", () => {
		it("should return 'true' because input is a file", () => {
			/* Arrange */
			const pathParam = "./src/app.ts"
			/* Assert */
			expect(isFile(pathParam)).toBe(true)
		})
		it("should return 'false' because input is not a file", () => {
			/* Arrange */
			const pathParam = "./app.ts"
			/* Assert */
			expect(isFile(pathParam)).toBe(false)
		})
		it("should return 'true' because input is a directory", () => {
			/* Arrange */
			const pathParam = "./src"
			/* Assert */
			expect(isDirectory(pathParam)).toBe(true)
		})
		it("should return 'false' because input is no directory", () => {
			/* Arrange */
			const pathParam = "./src/app.ts"
			/* Assert */
			expect(isDirectory(pathParam)).toBe(false)
		})
	})
	describe("It should handle directory/file creation correctly", () => {
		it("should create a new directory named 'input'", async () => {
			/* Act */
			const createDir = createDirectoryIfNotPresent(inDirectory)
			/* Assert */
			await expect(createDir).resolves.toBeDefined()
		})
		it("should create a new directory named 'out'", async () => {
			/* Act */
			const createDir = createDirectoryIfNotPresent(outDirectory)
			/* Assert */
			await expect(createDir).resolves.toBeDefined()
		})
		it("should throw an error because directory 'src' already exists", async () => {
			/* Arrange */
			const directoryName = "src"
			/* Act */
			const createDir = createDirectoryIfNotPresent(directoryName)
			/* Assert */
			await expect(createDir).resolves.toMatch(`Dir '${directoryName}' already exists.`)
		})
		it("should throw an error because directory param is empty", async () => {
			/* Arrange */
			const directoryName = ""
			/* Act */
			const createDir = createDirectoryIfNotPresent(directoryName)
			/* Assert */
			await expect(createDir).rejects.toBeUndefined()
		})
		it("should create a new file named 'test.txt'", async () => {
			/* Arrange */
			const filepath = "./testing/out/testfile.txt"
			const data = Buffer.from("Some example text to write to a file")
			/* Act */
			const createFile = writeToFile(filepath, data)
			/* Assert */
			await expect(createFile).resolves.toBe(`Created File in ${filepath}.`)
		})
	})
	describe("It should handle directory/file deletion correctly", () => {
		const testDirectoryContent = "./testing/test/nested/folder"
		const testFilePath = "./testing/testFile.txt"
		beforeAll(async () => {
			const fileContent = Buffer.from("This is test dummy content")
			try {
				await createDirectoryIfNotPresent(testDirectory)
				await createDirectoryIfNotPresent(testDirectoryContent)
				await writeToFile(testFilePath, fileContent)
			}
			catch (err) {
				// eslint-disable-next-line no-console
				console.log(err.message)
			}
		})
		it("should reject because 'path' is undefined", async () => {
			/* Arrange */
			const deletion = deleteFile()
			/* Assert */
			await expect(deletion).rejects.toThrow(InvalidPathError)
			await expect(deletion).rejects.toThrowError("No path was provided")
		})
		it("should reject because 'path' does not exist", async () => {
			/* Arrange */
			const nonExistentPath = "./nonexistent/test.txt"
			const deletion = deleteFile(nonExistentPath)
			/* Assert */
			await expect(deletion).rejects.toThrowError()
		})
		it("should reject because directory does not exist", () => {
			/* Arrange */
			const path = "./nonexistent/directory"
			/* Assert */
			expect(() => deleteFolderRecursive(path)).toThrowError(InvalidPathError)
			expect(
				() => deleteFolderRecursive(path)
			).toThrowError(
				`Given Path does not point to a directory: ${path}`
			)
		})
	})
	describe("It should handle file reading correctly", () => {
		const readFile = (path: string): Buffer => readFromFileSync(path)
		it("should return the file as buffer", () => {
			/* Arrange */
			const path = "./src/app.ts"
			/* Assert */
			expect(() => readFile(path)).not.toThrowError(InvalidPathError)
		})
		it("should throw an InvalidPathError, because provided file does not exist", () => {
			/* Arrange */
			const path = "source"
			/* Assert */
			expect(() => readFile(path)).toThrowError(InvalidPathError)
			expect(() => readFile(path)).toThrowError("No such file")
		})
	})
})