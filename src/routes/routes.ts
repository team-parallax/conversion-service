/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { Controller, ValidationService, FieldErrors, ValidateError, TsoaRoute, HttpStatusCodeLiteral, TsoaResponse } from 'tsoa';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ConversionController } from './../controller/conversion/index';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CapabilityController } from './../controller/ffmpeg-capabilities/index';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { IndexController } from './../controller/index';
import * as express from 'express';

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
	"IConversionProcessingResponse": {
		"dataType": "refObject",
		"properties": {
			"conversionId": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IUnsupportedConversionFormatError": {
		"dataType": "refObject",
		"properties": {
			"message": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"EConversionStatus": {
		"dataType": "refEnum",
		"enums": ["converted", "in queue", "processing"],
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IConversionStatus": {
		"dataType": "refObject",
		"properties": {
			"conversionId": { "dataType": "string", "required": true },
			"status": { "ref": "EConversionStatus", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IConversionQueueStatus": {
		"dataType": "refObject",
		"properties": {
			"conversions": { "dataType": "array", "array": { "ref": "IConversionStatus" }, "required": true },
			"remainingConversions": { "dataType": "double", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"ICodec": {
		"dataType": "refObject",
		"properties": {
			"canDecode": { "dataType": "boolean", "required": true },
			"canEncode": { "dataType": "boolean", "required": true },
			"description": { "dataType": "string", "required": true },
			"directRendering": { "dataType": "boolean" },
			"drawHorizBand": { "dataType": "boolean" },
			"intraFrameOnly": { "dataType": "boolean" },
			"isLossless": { "dataType": "boolean" },
			"isLossy": { "dataType": "boolean" },
			"type": { "dataType": "string", "required": true },
			"weirdFrameTruncation": { "dataType": "boolean" },
			"name": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IEncoder": {
		"dataType": "refObject",
		"properties": {
			"description": { "dataType": "string", "required": true },
			"directRendering": { "dataType": "boolean", "required": true },
			"drawHorizBand": { "dataType": "boolean", "required": true },
			"experimental": { "dataType": "boolean", "required": true },
			"frameMT": { "dataType": "boolean", "required": true },
			"sliceMT": { "dataType": "boolean", "required": true },
			"type": { "dataType": "string", "required": true },
			"name": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IFilter": {
		"dataType": "refObject",
		"properties": {
			"description": { "dataType": "string", "required": true },
			"input": { "dataType": "string", "required": true },
			"multipleInputs": { "dataType": "boolean", "required": true },
			"multipleOutputs": { "dataType": "boolean", "required": true },
			"output": { "dataType": "string", "required": true },
			"name": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IFormat": {
		"dataType": "refObject",
		"properties": {
			"canDemux": { "dataType": "boolean", "required": true },
			"canMux": { "dataType": "boolean", "required": true },
			"description": { "dataType": "string", "required": true },
			"name": { "dataType": "string", "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	"IFFmpegCapabilities": {
		"dataType": "refObject",
		"properties": {
			"codecs": { "dataType": "array", "array": { "ref": "ICodec" }, "required": true },
			"encoders": { "dataType": "array", "array": { "ref": "IEncoder" }, "required": true },
			"filters": { "dataType": "array", "array": { "ref": "IFilter" }, "required": true },
			"formats": { "dataType": "array", "array": { "ref": "IFormat" }, "required": true },
		},
		"additionalProperties": false,
	},
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const validationService = new ValidationService(models);

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: express.Express) {
	// ###########################################################################################################
	//  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
	//      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
	// ###########################################################################################################
	app.post('/conversion',
		function(request: any, response: any, next: any) {
			const args = {
				request: { "in": "request", "name": "request", "required": true, "dataType": "object" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new ConversionController();


			const promise = controller.convertFile.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/conversion',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new ConversionController();


			const promise = controller.getConversionQueueStatus.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/conversion/:conversionId',
		function(request: any, response: any, next: any) {
			const args = {
				conversionId: { "in": "path", "name": "conversionId", "required": true, "dataType": "string" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new ConversionController();


			const promise = controller.getConvertedFile.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/conversion/:conversionId/download',
		function(request: any, response: any, next: any) {
			const args = {
				conversionId: { "in": "path", "name": "conversionId", "required": true, "dataType": "string" },
				extension: { "default": "mp3", "in": "query", "name": "extension", "dataType": "string" },
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new ConversionController();


			const promise = controller.getConvertedFileDownload.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/capabilities',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new CapabilityController();


			const promise = controller.getAvailableCapabilities.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/capabilities/codecs',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new CapabilityController();


			const promise = controller.getAvailableCodecs.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/capabilities/encoders',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new CapabilityController();


			const promise = controller.getAvailableEncoders.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/capabilities/filter',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new CapabilityController();


			const promise = controller.getAvailableFilter.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/capabilities/formats',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new CapabilityController();


			const promise = controller.getAvailableFormats.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
	app.get('/ping',
		function(request: any, response: any, next: any) {
			const args = {
			};

			// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

			let validatedArgs: any[] = [];
			try {
				validatedArgs = getValidatedArgs(args, request, response);
			} catch (err) {
				return next(err);
			}

			const controller = new IndexController();


			const promise = controller.getPingResponse.apply(controller, validatedArgs as any);
			promiseHandler(controller, promise, response, next);
		});
	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function isController(object: any): object is Controller {
		return 'getHeaders' in object && 'getStatus' in object && 'setStatus' in object;
	}

	function promiseHandler(controllerObj: any, promise: any, response: any, next: any) {
		return Promise.resolve(promise)
			.then((data: any) => {
				let statusCode;
				let headers;
				if (isController(controllerObj)) {
					headers = controllerObj.getHeaders();
					statusCode = controllerObj.getStatus();
				}

				// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

				returnHandler(response, statusCode, data, headers)
			})
			.catch((error: any) => next(error));
	}

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function returnHandler(response: any, statusCode?: number, data?: any, headers: any = {}) {
		Object.keys(headers).forEach((name: string) => {
			response.set(name, headers[name]);
		});
		if (data && typeof data.pipe === 'function' && data.readable && typeof data._read === 'function') {
			data.pipe(response);
		} else if (data || data === false) { // === false allows boolean result
			response.status(statusCode || 200).json(data);
		} else {
			response.status(statusCode || 204).end();
		}
	}

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function responder(response: any): TsoaResponse<HttpStatusCodeLiteral, unknown> {
		return function(status, data, headers) {
			returnHandler(response, status, data, headers);
		};
	};

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

	function getValidatedArgs(args: any, request: any, response: any): any[] {
		const fieldErrors: FieldErrors = {};
		const values = Object.keys(args).map((key) => {
			const name = args[key].name;
			switch (args[key].in) {
				case 'request':
					return request;
				case 'query':
					return validationService.ValidateParam(args[key], request.query[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case 'path':
					return validationService.ValidateParam(args[key], request.params[name], name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case 'header':
					return validationService.ValidateParam(args[key], request.header(name), name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case 'body':
					return validationService.ValidateParam(args[key], request.body, name, fieldErrors, undefined, { "noImplicitAdditionalProperties": "throw-on-extras" });
				case 'body-prop':
					return validationService.ValidateParam(args[key], request.body[name], name, fieldErrors, 'body.', { "noImplicitAdditionalProperties": "throw-on-extras" });
				case 'res':
					return responder(response);
			}
		});

		if (Object.keys(fieldErrors).length > 0) {
			throw new ValidateError(fieldErrors, '');
		}
		return values;
	}

	// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
