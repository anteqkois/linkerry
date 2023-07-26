export interface HttpExceptionResponse {
  statusCode: number
  error: string
}

export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  path: string
  method: string
  code: string
  message: string
  timestamp: Date
}

const neccesaryKeys: Array<keyof CustomHttpExceptionResponse> = [
  'path',
  'method',
  'code',
  'message',
  'timestamp',
  'error',
  'statusCode',
]

export const isCustomHttpException = (object: unknown): object is CustomHttpExceptionResponse => {
  if (object === null || typeof object !== 'object') return false
  for (const key of neccesaryKeys) {
    if (!Object.keys(object).includes(key)) return false
  }
  return true
}
