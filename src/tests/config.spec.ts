import {
	ConfigurationCreationError,
	InvalidConfigurationSpecError,
	MissingConfigurationValueError, MissingWrapperDefinitionError,
	UnknownConversionRuleFormatError,
	UnknownConversionWrapperError
} from "../config/exception"
import {
	EConfigurationKey, EConversionRuleType, EConversionWrapper
} from "../enum"
import { IConversionWrapper } from "../config/interface"
import { ITestCaseInput, ITestCaseResult } from "./helper/interface"
import {
	createConversionPrecedenceOrderConfig,
	createConversionRule,
	createMaximaConfiguration, createWrapperConfiguration,
	getPortConfigValue,
	getRuleShape,
	getWrapperPathConfigKeyFromEnum,
	loadValueFromEnv, transformEnumToIWrapper, transformStringToWrapperCollection
} from "../config"
import { deleteEnvVarAndDefaultCollection } from "./helper/util"
import { getRandomNumber } from "./helper/dataFactory"
describe("It should pass all tests for initialization", () => {
	const initEnv = process.env
	beforeEach(() => {
		jest.resetModules()
		process.env = {
			...initEnv
		}
		process.env.MAX_CONVERSION_TRIES = "3"
		process.env.MAX_CONVERSION_TIME = "10"
	})
	afterAll(() => {
		process.env = initEnv
	})
	describe("It should load configuration parts correctly and handle errors accordingly", () => {
		describe("It should throw errors because of missing environment variables", () => {
			describe("createMaximaConfiguration should throw errors", () => {
				it(
					"should throw MissingConfigurationValueErrors because of both missing env-vars and defaults",
					() => {
						/* Arrange */
						const {
							maxConversionTime,
							maxConversionTries
						} = EConfigurationKey
						const testKeys: EConfigurationKey[] = [
							maxConversionTime, maxConversionTries
						]
						deleteEnvVarAndDefaultCollection(testKeys)
						/* Act */
						const getMaximaConfiguration = jest.fn(createMaximaConfiguration)
						/* Assert */
						expect(getMaximaConfiguration)
							.toThrow(MissingConfigurationValueError)
					}
				)
				it(
					"should throw MissingConfigurationValueErrors because of missing conversion-time env-var and default",
					() => {
						/* Arrange */
						const {
							maxConversionTime
						} = EConfigurationKey
						const testKeys: EConfigurationKey[] = [
							maxConversionTime
						]
						process.env.MAX_CONVERSION_TRIES = "1"
						deleteEnvVarAndDefaultCollection(testKeys)
						/* Act */
						const getMaximaConfiguration = jest.fn(createMaximaConfiguration)
						/* Assert */
						expect(getMaximaConfiguration)
							.toThrow(MissingConfigurationValueError)
					}
				)
				it(
					"should throw MissingConfigurationValueErrors because of missing conversion-tries env-var and default",
					() => {
						/* Arrange */
						const {
							maxConversionTries
						} = EConfigurationKey
						const testKeys: EConfigurationKey[] = [
							maxConversionTries
						]
						process.env.MAX_CONVERSION_TIME = "10"
						deleteEnvVarAndDefaultCollection(testKeys)
						/* Act */
						const getMaximaConfiguration = jest.fn(createMaximaConfiguration)
						/* Assert */
						expect(getMaximaConfiguration)
							.toThrow(MissingConfigurationValueError)
					}
				)
			})
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
			it("createWrapperConfiguration should not throw MissingConfigurationValueError although no unoconv path is set", () => {
				/* Arrange */
				process.env.CONVERTER_DOCUMENT_PRIORITY = "ffmpeg, unoconv"
				process.env.CONVERTER_MEDIA_PRIORITY = "ffmpeg"
				delete process.env?.[EConfigurationKey.unoconvPath]
				/* Act */
				const getWrapperConfiguration = jest.fn(createWrapperConfiguration)
				/* Assert */
				expect(getWrapperConfiguration).not.toThrow(MissingConfigurationValueError)
			})
			it("createWrapperConfiguration should throw MissingConfigurationValueError because no ffmpeg/unoconv path is set", () => {
				/* Arrange */
				process.env.CONVERTER_DOCUMENT_PRIORITY = "ffmpeg, unoconv"
				process.env.CONVERTER_MEDIA_PRIORITY = "ffmpeg"
				delete process.env?.[EConfigurationKey.unoconvPath]
				delete process.env?.[EConfigurationKey.ffmpegPath]
				/* Act */
				const getWrapperConfiguration = jest.fn(createWrapperConfiguration)
				/* Assert */
				expect(getWrapperConfiguration).toThrow(ConfigurationCreationError)
			})
			it("transformEnumToIWrapper should trow MissingConfigurationValueError", () => {
				/* Arrange */
				const wrapper = EConversionWrapper.imagemagick
				const envVar = EConfigurationKey[`${wrapper}Path`]
				/* Act */
				delete process.env[envVar]
				const getIWrapperFromEnum = jest.fn(
					(wrapperKey: EConversionWrapper) => transformEnumToIWrapper(wrapperKey)
				)
				/* Assert */
				expect(
					getIWrapperFromEnum.bind(null, wrapper)
				).toThrow(MissingConfigurationValueError)
			})
			it("transformEnumToIWrapper should return IWrapper object", () => {
				/* Arrange */
				const testEnumKeys: EConversionWrapper[] = [
					...Object.keys(EConversionWrapper).map(
						wrapper => EConversionWrapper[wrapper]
					)
				]
				const expectedWrappers: IConversionWrapper[] = []
				/* Act */
				for (const wrapperEnum of testEnumKeys) {
					/* Set necessary env variables */
					const configKey = getWrapperPathConfigKeyFromEnum(wrapperEnum)
					const wrapperPath = `/usr/bin/${wrapperEnum}`
					process.env[configKey] = wrapperPath
					expectedWrappers.push({
						binary: wrapperEnum,
						path: wrapperPath
					})
				}
				const isEqualBinaryValue = jest.fn(
					(
						wrapper: EConversionWrapper
					) => transformEnumToIWrapper(
						wrapper
					).binary === wrapper
				)
				/* Assert */
				for (const wrapper of testEnumKeys) {
					expect(isEqualBinaryValue(wrapper)).toBe(true)
				}
			})
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
					).toEqual(
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
		it("getPortConfigValue should throw MissingConfigurationError if port (and default) vars are missing", () => {
			/* Arrange */
			delete process.env.WEBSERVICE_PORT
			delete process.env.WEBSERVICE_PORT_DEFAULT
			/* Act */
			const getPortConfig = jest.fn(getPortConfigValue)
			/* Assert */
			expect(getPortConfig).toThrowError(MissingConfigurationValueError)
		})
		it("getPortConfigValue should return default port value if no port is set", () => {
			/* Arrange */
			delete process.env.WEBSERVICE_PORT_DEFAULT
			delete process.env.WEBSERVICE_PORT
			const upperBoundValue = 70000
			const defaultPort = getRandomNumber(upperBoundValue)
			process.env.WEBSERVICE_PORT_DEFAULT = `${defaultPort}`
			/* Act */
			const portConfig = getPortConfigValue()
			/* Assert */
			expect(portConfig).toBe(defaultPort)
		})
		it("getPortConfigValue should return port value if it is set or the default otherwise", () => {
			/* Arrange */
			delete process.env.WEBSERVICE_PORT_DEFAULT
			delete process.env.WEBSERVICE_PORT
			const upperBoundValue = 70000
			const defaultPort = 3000
			const randomPortNumber = getRandomNumber(upperBoundValue)
			process.env.WEBSERVICE_PORT = `${randomPortNumber}`
			/* Act */
			const portConfig = getPortConfigValue()
			const isRandomOrDefaultPort = portConfig === randomPortNumber
				|| portConfig === defaultPort
			/* Assert */
			expect(isRandomOrDefaultPort).toBe(true)
		})
		it("should return undefined for unset/unknown variables and the value if set", () => {
			/* Arrange */
			const testKeys: (string | EConfigurationKey)[] = [
				"foo", "KEY",
				EConfigurationKey.webservicePort,
				"", "BAR", "OTHER",
				EConfigurationKey.maxConversionTime
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
		describe("It should handle rule config reading and initialization correct", () => {
			it("createConversionRule should throw InvalidConfigurationSpecError if no value is provided for rule", () => {
				/* Arrange */
				const emptyRule = ""
				/* Act */
				const getRule = jest.fn(createConversionRule)
				/* Assert */
				expect(getRule.bind(null, emptyRule)).toThrowError(InvalidConfigurationSpecError)
			})
			it("createConversionRule should return undefined for unknown rule schema", () => {
				/* Arrange */
				const unknownRuleSchema = "Some-random_Format"
				/* Act */
				const getRule = jest.fn(createConversionRule)
				/* Assert */
				expect(getRule(unknownRuleSchema)).toBe(undefined)
			})
			it("createConversionRule should return an type 'mono' IConversionRule for valid input", () => {
				/* Arrange */
				const monoRuleStrings = [
					"CONVERT_TO_PDF_WITH",
					"CONVERT_TO_PNG_WITH"
				]
				/* Act */
				const getRule = jest.fn(createConversionRule)
				/* Assert */
				for (const monoRuleString of monoRuleStrings) {
					process.env[monoRuleString] = "unoconv"
					const expectedValue = loadValueFromEnv(monoRuleString)
					expect(getRule(monoRuleString)).toEqual({
						rule: expectedValue,
						ruleType: EConversionRuleType.mono
					})
				}
			})
			it("createConversionRule should return an type 'multi' IConversionRule for valid input", () => {
				/* Arrange */
				const multiRuleStrings = [
					"CONVERT_FROM_PNG_TO_PDF_WITH",
					"CONVERT_FROM_JPG_TO_PDF_WITH",
					"CONVERT_FROM_TXT_TO_HTML_WITH",
					"CONVERT_FROM_DOCX_TO_PDF_WITH",
					"CONVERT_FROM_A_TO_PNG_WITH"
				]
				/* Act */
				const getRule = jest.fn(createConversionRule)
				/* Assert */
				for (const multiRuleString of multiRuleStrings) {
					process.env[multiRuleString] = "imagemagick"
					const expectedValue = loadValueFromEnv(multiRuleString)
					expect(getRule(multiRuleString)).toEqual({
						rule: expectedValue,
						ruleType: EConversionRuleType.multi
					})
				}
			})
			it("getRuleShape should throw UnknownConversionRuleFormatError because of malformed input", () => {
				/* Arrange */
				const conversionRules: string[] = [
					"SOME_WRONG_THING",
					"AnotherWrongFormat",
					"CONVert_TO_format_WITH",
					"jpg"
				]
				/* Act */
				const getTestResultShape = (rule: string): EConversionRuleType => getRuleShape(rule)
				/* Assert */
				for (const rule of conversionRules) {
					expect(
						getTestResultShape.bind(null, rule)
					).toThrow(UnknownConversionRuleFormatError)
				}
			})
			it("getRuleShape should return EConversionRuleType.mono", () => {
				/* Arrange */
				const conversionRules: string[] = [
					"CONVERT_TO_FILE_WITH",
					"CONVERT_TO_X_WITH",
					"CONVERT_TO_PNG_WITH"
				]
				/* Act */
				const getTestResultShape = (rule: string): EConversionRuleType => getRuleShape(rule)
				/* Assert */
				for (const rule of conversionRules) {
					expect(
						getTestResultShape(rule)
					).toEqual(EConversionRuleType.mono)
				}
			})
			it("getRuleShape should return EConversionRuleType.multi", () => {
				/* Arrange */
				const conversionRules: string[] = [
					"CONVERT_FROM_WINE_TO_WATER_WITH",
					"CONVERT_FROM_X_TO_FILE_WITH",
					"CONVERT_FROM_TEST_TO_X_WITH",
					"CONVERT_FROM_ANOTHER_TO_PNG_WITH"
				]
				/* Act */
				const getTestResultShape = (rule: string): EConversionRuleType => getRuleShape(rule)
				/* Assert */
				for (const rule of conversionRules) {
					expect(
						getTestResultShape(rule)
					).toEqual(EConversionRuleType.multi)
				}
			})
		})
	})
})