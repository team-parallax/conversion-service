import {
	ConfigurationCreationError,
	MissingConfigurationValueError, MissingWrapperDefinitionError,
	UnknownConversionWrapperError
} from "../init/exception"
import { EConfigurationKey, EConversionWrapper } from "../init/enum"
import { ITestCaseInput, ITestCaseResult } from "~/tests/interface"
import {
	createConversionPrecedenceOrderConfig,
	createMaximaConfiguration, createWrapperConfiguration,
	loadValueFromEnv, transformStringToWrapperCollection
} from "../init"
describe("It should pass all tests for initialization", () => {
	const initEnv = process.env
	beforeEach(() => {
		jest.resetModules()
		process.env = {
			...initEnv
		}
	})
	afterAll(() => {
		process.env = initEnv
	})
	it("should return undefined for unset/unknown variables and the value if set", () => {
		/* Arrange */
		const testKeys: (string | EConfigurationKey)[] = [
			"foo", "", "BAR", "KEY", "OTHER", EConfigurationKey.maxConversionTime
		]
		const testCaseInputs: ITestCaseInput<string, undefined>[] = []
		const getTestResults = (
			testInput: ITestCaseInput<string, undefined>[]
		): ITestCaseResult<string, undefined>[] => {
			const testResults = []
			for (const testCaseInput of testInput) {
				const {
					testInput: variableKey
				} = testCaseInput
				const result = loadValueFromEnv(variableKey)
				testResults.push({
					...testCaseInput,
					testResult: result
				})
			}
			return testResults
		}
		for (const testKey of testKeys) {
			const decimalBase = 10
			const evenDivider = 2
			const shouldDeleteTestKey = Math.random() * decimalBase % evenDivider === 0
			if (shouldDeleteTestKey) {
				delete process.env?.[testKey]
				testCaseInputs.push({
					expectedResult: undefined,
					testInput: testKey
				})
			}
			else {
				process.env[testKey] = testKey
				testCaseInputs.push({
					expectedResult: testKey,
					testInput: testKey
				})
			}
		}
		/* Act */
		const testCaseResults: ITestCaseResult<string, undefined>[] = getTestResults(
			testCaseInputs
		)
		/* Assert */
		for (const testCaseResult of testCaseResults) {
			const {
				testResult: actualResult,
				expectedResult
			} = testCaseResult
			expect(actualResult)
				.toEqual(expectedResult)
		}
	})
	describe("It should load configuration parts correctly and handle errors accordingly", () => {
		describe("It should throw errors because of missing environment variables", () => {
			it(
				"createMaximaConfiguration should throw MissingConfigurationValueErrors because of both missing env-vars",
				() => {
					/* Arrange */
					const {
						maxConversionTime,
						maxConversionTries
					} = EConfigurationKey
					const testKeys: EConfigurationKey[] = [
						maxConversionTime, maxConversionTries
					]
					process.env.MAX_CONVERSION_TRIES = "1"
					process.env.MAX_CONVERSION_TIME = "10"
					for (const key of testKeys) {
						delete process.env[key]
					}
					// eslint-disable-next-line no-console
					console.debug(
						"max tries: ", process.env.MAX_CONVERSION_TRIES,
						"\nmax time: ", process.env.MAX_CONVERSION_TIME
					)
					/* Act */
					const getMaximaConfiguration = jest.fn(createMaximaConfiguration)
					/* Assert */
					expect(getMaximaConfiguration)
						.toThrow(MissingConfigurationValueError)
				}
			)
			it(
				"createMaximaConfiguration should throw MissingConfigurationValueErrors because of missing conversion-time env-var",
				() => {
					/* Arrange */
					const {
						maxConversionTime
					} = EConfigurationKey
					const testKeys: EConfigurationKey[] = [
						maxConversionTime
					]
					process.env.MAX_CONVERSION_TRIES = "1"
					for (const key of testKeys) {
						delete process.env[key]
					}
					/* Act */
					const getMaximaConfiguration = jest.fn(createMaximaConfiguration)
					/* Assert */
					expect(getMaximaConfiguration)
						.toThrow(MissingConfigurationValueError)
				}
			)
			it(
				"createMaximaConfiguration should throw MissingConfigurationValueErrors because of missing conversion-tries env-var",
				() => {
					/* Arrange */
					const {
						maxConversionTries
					} = EConfigurationKey
					const testKeys: EConfigurationKey[] = [
						maxConversionTries
					]
					process.env.MAX_CONVERSION_TIME = "10"
					for (const key of testKeys) {
						delete process.env[key]
					}
					/* Act */
					const getMaximaConfiguration = jest.fn(createMaximaConfiguration)
					/* Assert */
					expect(getMaximaConfiguration)
						.toThrow(MissingConfigurationValueError)
				}
			)
			it(
				"createConversionPrecedenceOrder should throw MissingWrapperDefinitionError because of missing env-vars",
				() => {
					/* Arrange */
					const {
						converterDocumentPriority,
						converterMediaPriority
					} = EConfigurationKey
					const testKeys: EConfigurationKey[] = [
						converterDocumentPriority, converterMediaPriority
					]
					for (const key of testKeys) {
						delete process.env?.[key]
					}
					/* Act */
					const getPrecedenceOrder = jest.fn(createConversionPrecedenceOrderConfig)
					/* Assert */
					expect(getPrecedenceOrder)
						.toThrow(MissingWrapperDefinitionError)
				}
			)
			it("createWrapperConfiguration should throw ConfigurationCreationError", () => {
				/* Arrange */
				delete process.env?.[EConfigurationKey.converterDocumentPriority]
				delete process.env?.[EConfigurationKey.converterMediaPriority]
				/* Act */
				const getWrapperConfiguration = jest.fn(createWrapperConfiguration)
				/* Assert */
				expect(getWrapperConfiguration).toThrow(ConfigurationCreationError)
			})
			it("createWrapperConfiguration should throw MissingConfigurationValueError because no unoconv path is set", () => {
				/* Arrange */
				process.env.CONVERTER_DOCUMENT_PRIORITY = "ffmpeg, unoconv"
				process.env.CONVERTER_MEDIA_PRIORITY = "ffmpeg"
				delete process.env?.[EConfigurationKey.unoconvPath]
				/* Act */
				const getWrapperConfiguration = jest.fn(createWrapperConfiguration)
				/* Assert */
				expect(getWrapperConfiguration).toThrow(MissingConfigurationValueError)
			})
			it.todo("transformEnumToIWrapper should trow MissingConfigurationValueError")
			it.todo("transformEnumToIWrapper should return IWrapper object")
		})
		describe("It should handle wrapper configuration assembly correctly", () => {
			it("transformStringToWrapperCollection should return EConversionWrapper[]", () => {
				/* Arrange */
				const testWrapperStrings: string[] = [
					"ffmpeg,unoconv", "imagemagick", "ffmpeg", "unoconv"
				]
				const testResults: ITestCaseResult<string, EConversionWrapper[]>[] = []
				const createWrapperCollectionArray = (
					wrapperCollection: string
				): EConversionWrapper[] => wrapperCollection.split(",")
					.map(
						wrapper => EConversionWrapper[wrapper]
					)
				/* Act */
				for (const testWrapperString of testWrapperStrings) {
					const expectedResult: EConversionWrapper[] = createWrapperCollectionArray(
						testWrapperString
					)
					const resultWrapperCollection = transformStringToWrapperCollection(
						testWrapperString
					)
					testResults.push({
						expectedResult,
						testInput: testWrapperString,
						testResult: resultWrapperCollection
					})
				}
				/* Assert */
				for (const wrapperCollectionTestResult of testResults) {
					expect(
						wrapperCollectionTestResult.testResult
					)
						.toEqual(
							wrapperCollectionTestResult.expectedResult
						)
				}
			})
			it("transformStringToWrapperCollection should throw UnknownConversionWrapperError", () => {
				/* Arrange */
				const testWrapperStrings: string[] = [
					"unopeg, imageconv", "moodle", "test:123"
				]
				/* Act */
				const getConversionWrapperCollection = jest.fn(
					(
						testWrapperString: string
					): EConversionWrapper[] => transformStringToWrapperCollection(testWrapperString)
				)
				/* Assert */
				for (const testWrapperString of testWrapperStrings) {
					expect(
						getConversionWrapperCollection.bind(null, testWrapperString)
					)
						.toThrow(UnknownConversionWrapperError)
				}
			})
		})
	})
})