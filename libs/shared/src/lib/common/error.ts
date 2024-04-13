import { PlanProductConfiguration, planConfigurationDetails } from '../modules/billing/products'
import { ErrorCode, ErrorCodeQuota } from './errorCodes'

export interface HttpExceptionResponse {
	statusCode: number
	error: string
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
	path: string
	method: string
	code: string
	message: string
	fieldPath?: string
	timestamp: Date
}

export interface CustomWebSocketExceptionResponse {
	error: string
	event: string
	code: string
	message: string
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

// TODO implement every cusotm code with typed props
type CustomErrorMetadata = { userMessage?: string } & Record<string, any>

export class CustomError extends Error {
	override name = 'CustomError'
	isOperational = true
	metadata: CustomErrorMetadata | undefined
	code: ErrorCode

	constructor(
		message: string,
		code: ErrorCode,
		metadata?: CustomErrorMetadata,
		// isOperational = true
	) {
		super(message)
		// super(`${code} ${message}`)
		this.metadata = metadata
		this.code = code
		Error.captureStackTrace(this, this.constructor)
	}
}

export const isCustomError = (object: unknown): object is CustomError => {
	if (object instanceof CustomError) return true
	return false
}

export class QuotaError extends CustomError {
	override code: ErrorCodeQuota
	constructor(limitName: keyof PlanProductConfiguration) {
		super(`Reach plan limit: ${limitName}`, planConfigurationDetails[limitName].errorCode)
		this.code = planConfigurationDetails[limitName].errorCode
	}
}

export const isQuotaError = (object: unknown): object is QuotaError & { code: ErrorCodeQuota } => {
	console.log(object instanceof CustomError)
	if (object instanceof CustomError && object.code.includes('QUOTA_EXCEEDED')) return true
	return false
}

export const isQuotaErrorCode = (code: string): code is ErrorCodeQuota => {
	if (code.includes('QUOTA_EXCEEDED')) return true
	return false
}
