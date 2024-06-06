import { AxiosError } from 'axios'

export class HttpError<T = any, D = any> extends Error {
  constructor(private readonly _requestBody: unknown, readonly axiosError: AxiosError<T, D>) {
    super(
      JSON.stringify({
        response: {
          status: axiosError?.response?.status || 500,
          body: axiosError?.response?.data,
        },
        request: {
          body: _requestBody,
        },
      }),
    )
  }

  public errorMessage() {
    return {
      response: {
        status: this.axiosError?.response?.status || 500,
        body: this.axiosError?.response?.data,
      },
      request: {
        body: this._requestBody,
      },
    }
  }

  get response() {
    return {
      status: this.axiosError?.response?.status || 500,
      body: this.axiosError?.response?.data,
    }
  }

  get request() {
    return {
      body: this._requestBody,
    }
  }

  static isHttpError(error: unknown): error is HttpError {
    if (error && typeof error === 'object' && 'axiosError' in error) return true
    return false
  }
}
