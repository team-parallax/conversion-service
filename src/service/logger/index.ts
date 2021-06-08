/* eslint-disable no-console */
export class Logger {
	private readonly indentationDepth: number = 2
	error = (content: any): void => {
		console.error(JSON.stringify(content, null, this.indentationDepth))
	}
	log = (content: any): void => {
		console.log(JSON.stringify(content, null, this.indentationDepth))
	}
}