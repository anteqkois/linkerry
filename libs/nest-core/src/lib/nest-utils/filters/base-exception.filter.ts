import { ErrorCode, HttpExceptionResponse, isCustomError } from '@linkerry/shared'
import { HttpException, HttpStatus } from '@nestjs/common'
import { ZodError } from 'zod'
import { DtoException } from '../pipes'
import { formatZodIssue } from './format-zod.error'

interface TypiaHttpException {
	path: string // '$input._id',
	reason: string // 'Error on typia.assert(): invalid type on $input._id, expect to be (string & Pattern<"^[0-9a-f]{24}$">)',
	expected: string // '(string & Pattern<"^[0-9a-f]{24}$">)',
	value: any // undefined,
	message: string // 'Request body data is not following the promised type.'
}

const isTypiaExceptionResponse = (exception: any): exception is { response: TypiaHttpException } => {
	// if (typeof exception === 'object' && 'response' in exception && 'reason' in exception.response && exception.response.reason.includes('typia'))
	if (exception?.response?.reason?.includes('typia')) return true
	return false
}

export class CustomBaseExceptionsFilter {
	produceFields(exception: unknown) {
		let status: HttpStatus
		let errorCode: ErrorCode = ErrorCode.INTERNAL_SERVER
		let errorMessage: string
		let humanMessage: string
		let fieldPath: string | undefined
		let metadata: any

		if (exception instanceof DtoException) {
			status = HttpStatus.UNPROCESSABLE_ENTITY
			const errorResponse = exception.getResponse()
			errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message
			humanMessage = errorMessage
			fieldPath = exception.field
			errorCode = ErrorCode.VALIDATION
		} else if (exception instanceof ZodError) {
			// TODO handle all errors, not only one
			status = HttpStatus.UNPROCESSABLE_ENTITY
			console.dir(exception.format(), { depth: null })
			const formatedError = formatZodIssue(exception.errors[0])
			errorMessage = formatedError.message
			humanMessage = formatedError.message
			fieldPath = formatedError.path
			errorCode = ErrorCode.VALIDATION
		} else if (isTypiaExceptionResponse(exception)) {
			status = HttpStatus.UNPROCESSABLE_ENTITY
			errorMessage = exception.response.reason
			humanMessage = exception.response.message
			errorCode = ErrorCode.VALIDATION
			fieldPath = exception.response.path
		} else if (exception instanceof HttpException) {
			status = exception.getStatus()
			const errorResponse = exception.getResponse()
			errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message
			humanMessage = exception.message
			errorCode = ErrorCode.HTTP
		} else if (exception instanceof Error && exception.name === 'ValidationError') {
			status = HttpStatus.UNPROCESSABLE_ENTITY
			errorMessage = exception.message
			humanMessage = exception.message
			errorCode = ErrorCode.VALIDATION
		} else if (exception instanceof Error && exception.name === 'MongoServerError') {
			status = HttpStatus.UNPROCESSABLE_ENTITY
			errorMessage = exception.message
			humanMessage = exception.message
			errorCode = ErrorCode.DATABASE_INTERNAL
		} else if (isCustomError(exception)) {
			status = HttpStatus.UNPROCESSABLE_ENTITY
			errorMessage = exception.message
			humanMessage = exception.metadata?.userMessage ?? exception.message
			metadata = exception.metadata
			errorCode = exception.code
		} else {
			console.log(exception)
			status = HttpStatus.INTERNAL_SERVER_ERROR
			errorMessage = 'Critical internal server error occurred!'
			humanMessage = 'Internal server error occurred'
			errorCode = ErrorCode.INTERNAL_SERVER
		}

		return {
			status,
			errorCode,
			errorMessage,
			humanMessage,
			fieldPath,
			metadata,
		}
	}
}
