import { EHttpResponseCodes } from "../../constants"
import { Inject } from "typescript-ioc"
import { Logger } from "../logger"
import { RegisterRoutes } from "../../routes/routes"
import { ValidateError } from "tsoa"
import { createDirectoryIfNotPresent } from "../file-io"
import { generateHTML, serve } from "swagger-ui-express"
import Ffmpeg from "fluent-ffmpeg"
import cors from "cors"
import express, {
	Application,
	Express,
	NextFunction,
	Request,
	Response,
	json,
	urlencoded
} from "express"
import path from "path"
import swaggerDocument from "../../../swagger.json"
export class Api {
	@Inject
	private readonly logger!: Logger
	private readonly _port: number
	private readonly app: Application
	private readonly defaultPort: number = 3000
	private readonly startUpDelay: number = 1500
	constructor(port?: number) {
		this.app = express()
		this._port = port ?? this.defaultPort
		this.configureServer()
		this.addApi()
		Ffmpeg().setFfmpegPath("/opt/ffmpeg/bin/ffmpeg")
		this.createApplicationDirectiories(["input", "output"])
		setTimeout(
			() => this.listen(),
			this.startUpDelay
		)
	}
	listen = (): void => {
		this.app.listen(this.port, () => {
			this.logger.log(`Listening on port ${this.port}`)
		})
	}
	private readonly addApi = (): void => {
		const {
			internalServerError,
			notFound,
			validationError
		} = EHttpResponseCodes
		this.app.get("/", (req, res, err) => {
			res.send("Request received")
		})
		this.app.use("/docs", serve, async (req: Request, res: Response) => {
			return res.send(
				generateHTML(await import("../../../swagger.json"))
			)
		})
		RegisterRoutes(this.app as Express)
		this.app.get("/swagger.json", (req: Request, res: Response) => res.json(swaggerDocument))
		this.app.use((
			err: unknown,
			req: Request,
			res: Response,
			next: NextFunction
		): Response | void => {
			if (err instanceof ValidateError) {
				console.warn(`Caught Validation Error for ${req.path}:`, err.fields)
				return res.status(validationError).json({
					details: err?.fields,
					message: "Validation Failed"
				})
			}
			if (err instanceof Error) {
				return res.status(internalServerError).json({
					message: "Internal Server Error"
				})
			}
			next()
		})
		this.app.use((req: Request, res: Response) => {
			res.status(notFound).send({
				message: "Not Found"
			})
		})
	}
	private readonly configureServer = (): void => {
		// Mount json form parser
		this.app.use(cors())
		// Set max limit
		this.app.use(urlencoded({
			extended: true,
			limit: "50mb"
		}))
		this.app.use(json({
			limit: "50mb"
		}))
		this.app.use((req: Request, res: Response, next: NextFunction) => {
			res.header("Access-Control-Allow-Origin", "*")
			res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
			console.log(`Request received: ${req.method} ${req.url}`)
			next()
		})
	}
	private createApplicationDirectiories(directories: string[]): void {
		const basePath = path.join(__dirname, "../../..")
		const promises = []
		for (const directory of directories) {
			promises.push(createDirectoryIfNotPresent(path.join(basePath, directory)))
		}
		Promise.all(promises)
			.then(res => console.log(res))
			.catch(console.error)
	}
	get port(): number {
		return this._port
	}
}