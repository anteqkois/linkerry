export interface HttpExceptionResponse {
	statusCode: number
	error: string
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
	path: string
	method: string
	code: string
	message: string
	field?: string
	timestamp: Date
}

const neccesaryKeys: Array<keyof CustomHttpExceptionResponse> = ['path', 'method', 'code', 'message', 'timestamp', 'error', 'statusCode']

export const isCustomHttpException = (object: unknown): object is CustomHttpExceptionResponse => {
	if (!(object instanceof Object)) return false
	for (const key of neccesaryKeys) {
		if (!Object.keys(object).includes(key)) return false
	}
	return true
}

export const isCustomHttpExceptionAxios = (object: unknown): object is { response: { data: CustomHttpExceptionResponse } } => {
	if (
		object instanceof Object &&
		'response' in object &&
		object.response instanceof Object &&
		'data' in object.response &&
		object.response.data instanceof Object
	)
		return isCustomHttpException(object.response.data)
	return false
}

export class CustomError extends Error {
	type = 'CustomError'
	isOperational = true

	constructor(message: string, isOperational = true) {
		super()
		this.message = message
		this.isOperational = isOperational
		Error.captureStackTrace(this, this.constructor)
	}
}

export const isCustomError = (object: unknown): object is CustomError => {
	if (object instanceof CustomError) return true
	return false
}
