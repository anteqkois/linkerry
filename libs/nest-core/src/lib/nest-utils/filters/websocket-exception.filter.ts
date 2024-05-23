/* eslint-disable @typescript-eslint/ban-types */
// import * as fs from 'fs';
import { CustomWebSocketExceptionResponse, WEBSOCKET_EVENT } from '@linkerry/shared'
import { ArgumentsHost, Catch, Logger } from '@nestjs/common'
import { BaseWsExceptionFilter } from '@nestjs/websockets'
import { Socket } from 'socket.io'
import { CustomBaseExceptionsFilter } from './base-exception.filter'

@Catch()
export class AllExceptionsWebsocketFilter extends CustomBaseExceptionsFilter implements BaseWsExceptionFilter {
  private readonly logger = new Logger(AllExceptionsWebsocketFilter.name)

  handleError<TClient extends { emit: Function }>(client: TClient, exception: any): void {
    //
  }

  handleUnknownError<TClient extends { emit: Function }>(exception: any, client: TClient): void {
    //
  }

  isExceptionObject(err: any): err is Error {
    return true
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToWs()
    const event = ctx.getPattern()
    const client = ctx.getClient<Socket>()

    const { errorCode, errorMessage, humanMessage, metadata } = this.produceFields(exception)

    const errorResponse = this.getErrorResponse({
      event,
      errorMessage,
      errorCode,
      message: humanMessage,
    })
    const errorLog = this.getErrorLog(humanMessage, event, exception, (client.handshake as any)?.user.id)
    this.logger.error(errorLog, metadata)

    client.emit(WEBSOCKET_EVENT.EXCEPTION, errorResponse)
    // this.writeErrorLogToFile(errorLog);
  }

  private getErrorResponse = ({
    errorCode,
    errorMessage,
    message,
    event,
  }: {
    errorMessage: string
    errorCode: string
    message: string
    fieldPath?: string
    event: string
  }): CustomWebSocketExceptionResponse => ({
    code: errorCode,
    message,
    error: errorMessage,
    timestamp: new Date(),
    event,
  })

  private getErrorLog = (humanMessage: string, event: string, exception: any, userId?: string): string => {
    const errorLog = `[${event}] ${humanMessage}
    User: ${JSON.stringify(userId ?? 'unknown')}
		${exception?.stack}`
    return errorLog
  }
}
