// import * as fs from 'fs';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import {
  CustomHttpExceptionResponse,
  HttpExceptionResponse,
} from '../models/index';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    let status: HttpStatus;
    let errorMessage: string;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorResponse = exception.getResponse();
      errorMessage =
        (errorResponse as HttpExceptionResponse).error || exception.message;
    } else if (exception instanceof Error && exception.name === 'ValidationError') {
      // DTO validation
      // TODO handle many errors using exception.errors
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      errorMessage = exception.message;
    } else if (exception instanceof Error && exception.name === 'MongoServerError') {
      // Mongo validation
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      errorMessage = exception.message;
    } else {
      console.log(exception);
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorMessage = 'Critical internal server error occurred!';
    }

    const errorResponse = this.getErrorResponse(status, errorMessage, request);
    const errorLog = this.getErrorLog(errorResponse, request, exception);
    this.logger.error(errorLog)
    // this.writeErrorLogToFile(errorLog);
    response.status(status).send(errorResponse);
  }

  private getErrorResponse = (
    status: HttpStatus,
    errorMessage: string,
    request: FastifyRequest,
  ): CustomHttpExceptionResponse => ({
    statusCode: status,
    error: errorMessage,
    path: request.url,
    method: request.method,
    timeStamp: new Date(),
  });

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
    request: FastifyRequest & { user?: any },
    exception: unknown,
  ): string => {
    const { statusCode, error } = errorResponse;
    const { method, url } = request;
    const errorLog = `[${ method }] ${ url } - ${ statusCode }
    ${ JSON.stringify(errorResponse) }
    User: ${ JSON.stringify(request.user ?? 'Not signed in') }`;
    return errorLog;
    // const errorLog = `[${ method }] ${ url } - ${ statusCode }
    // ${ JSON.stringify(errorResponse) }
    // User: ${ JSON.stringify(request.user ?? 'Not signed in') }
    // ${ exception instanceof HttpException ? exception.stack : error }`;
    // return errorLog;
  };

  // private writeErrorLogToFile = (errorLog: string): void => {
  //   fs.appendFile('error.log', errorLog, 'utf8', (err) => {
  //     if (err) throw err;
  //   });
  // };
}
