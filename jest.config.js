module.exports = {
	globals: {
		"ts-jest": {
			"diagnostics": false
		}
	},
	moduleDirectories: [
		"node_modules",
		"src"
	],
	moduleFileExtensions: [
		"ts",
		"js",
		"node"
	],
	moduleNameMapper: {
		"^Controller(.*)$": "<rootDir>/src/controller$1",
		"^Model(.*)$": "<rootDir>/src/model$1",
		"^Services(.*)$": "<rootDir>/src/services$1",
		"~/": "<rootDir>/src/"
	},
	setupFilesAfterEnv: [
		"./jest.setup.ts"
	],
	testRegex: [
		"(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$"
	],
	transform: {
		".ts$": "ts-jest"
	},
	transformIgnorePatterns: [
		"!node_modules/"
	],
	verbose: true
}