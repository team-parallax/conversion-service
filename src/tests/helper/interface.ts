export interface ITestCaseInput<T, U = void> {
	expectedResult: T | U,
	testInput: T
}
export interface ITestCaseResult<T, U = void> extends ITestCaseInput<T, U> {
	testResult: T | U
}