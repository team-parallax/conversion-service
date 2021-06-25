import "jest"
import { config as dotenvConfig } from "dotenv"
import { resolve } from "path"
dotenvConfig({
	path: resolve("./template.env")
})
const maxTestTime = 30000
jest.setTimeout(maxTestTime)