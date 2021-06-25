export const deleteEnvVarAndDefault = (variablekey: string): void => {
	delete process.env?.[variablekey]
	delete process.env?.[`${variablekey}_DEFAULT`]
}
export const deleteEnvVarAndDefaultCollection = (keyCollection: string[]): void => {
	for (const key of keyCollection) {
		deleteEnvVarAndDefault(key)
	}
}