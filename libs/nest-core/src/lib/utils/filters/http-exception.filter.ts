// import * as fs from 'fs';
import { CustomHttpExceptionResponse, HttpExceptionResponse } from '@market-connector/shared'
import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common'
import { FastifyReply, FastifyRequest } from 'fastify'
import { DtoException } from '../pipes'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name)

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<FastifyReply>()
    const request = ctx.getRequest<FastifyRequest>()

    let status: HttpStatus
    let errorCode = 'UNKNOWN_ERROR'
    let errorMessage: string
    let humanMessage: string
    let field: string | undefined

    if (exception instanceof DtoException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      const errorResponse = exception.getResponse()
      errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message
      humanMessage = errorMessage
      field = exception.field
      errorCode = 'DtoException'
    } else if (exception instanceof HttpException) {
      status = exception.getStatus()
      const errorResponse = exception.getResponse()
      errorMessage = (errorResponse as HttpExceptionResponse).error || exception.message
      humanMessage = exception.message
      errorCode = 'HttpException'
    } else if (exception instanceof Error && exception.name === 'ValidationError') {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      errorMessage = exception.message
      humanMessage = exception.message
      errorCode = 'ValidationError'
    } else if (exception instanceof Error && exception.name === 'MongoServerError') {
      status = HttpStatus.UNPROCESSABLE_ENTITY
      errorMessage = exception.message
      humanMessage = exception.message
      errorCode = 'MongoServerError'
    } else {
      console.log(exception)
      status = HttpStatus.INTERNAL_SERVER_ERROR
      errorMessage = 'Critical internal server error occurred!'
      humanMessage = 'Internal server error occurred'
      errorCode = 'InternalError'
    }

    const errorResponse = this.getErrorResponse({
      status,
      errorMessage,
      errorCode,
      message: humanMessage,
      request,
      field,
    })
    const errorLog = this.getErrorLog(errorResponse, humanMessage, request, exception)
    this.logger.error(errorLog)
    // this.writeErrorLogToFile(errorLog);
    response.status(status).send(errorResponse)
  }

  private getErrorResponse = ({
    errorCode,
    errorMessage,
    message,
    request,
    status,
    field,
  }: {
    status: HttpStatus
    errorMessage: string
    errorCode: string
    message: string
    request: FastifyRequest
    field?: string
  }): CustomHttpExceptionResponse => ({
    statusCode: status,
    code: errorCode,
    message,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timestamp: new Date(),
    field,
    // request_id
    // "details": {
    //   "field": "product_id",
    //   "value": "12345",
    //   "reason": "Product with ID 12345 not found."
    // },
  })

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    humanMessage: string,
    request: FastifyRequest & { user?: any },
    exception: unknown,
  ): string => {
    const { statusCode } = errorResponse
    const { method, url } = request
    const errorLog = `[${method}] ${url} - ${statusCode}
    ${humanMessage}
    User: ${JSON.stringify(request.user ?? 'unknown')}`
    return errorLog
  }

  // private writeErrorLogToFile = (errorLog: string): void => {
  //   fs.appendFile('error.log', errorLog, 'utf8', (err) => {
  //     if (err) throw err;
  //   });
  // };
}
