export class Logger {
	error = (content: any): void => {
		console.error(JSON.stringify(content))
	}
	log = (content: string): void => {
		console.log(content)
	}
}