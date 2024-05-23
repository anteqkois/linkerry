import axios, { AxiosRequestConfig } from 'axios'
import { BaseHttpClient } from '../core/base-http-client'
import { DelegatingAuthenticationConverter } from '../core/delegating-authentication-converter'
import { HttpError } from '../core/http-error'
import { HttpHeaders } from '../core/http-headers'
import { HttpMessageBody } from '../core/http-message-body'
import { HttpMethod } from '../core/http-method'
import { HttpRequest } from '../core/http-request'
import { HttpResponse } from '../core/http-response'

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
export class AxiosHttpClient extends BaseHttpClient {
  constructor(baseUrl = '', authenticationConverter: DelegatingAuthenticationConverter = new DelegatingAuthenticationConverter()) {
    super(baseUrl, authenticationConverter)
  }

  async sendRequest<ResponseBody extends HttpMessageBody>(request: HttpRequest<HttpMessageBody>): Promise<HttpResponse<ResponseBody>> {
    try {
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'
      const { urlWithoutQueryParams, queryParams } = this.getUrl(request)
      const headers = this.getHeaders(request)
      const axiosRequestMethod = this.getAxiosRequestMethod(request.method)
      const timeout = request.timeout ? request.timeout : 0
      const config: AxiosRequestConfig = {
        method: axiosRequestMethod,
        url: urlWithoutQueryParams,
        params: {
          ...queryParams,
          ...request.queryParams,
        },
        headers,
        data: request.body,
        timeout,
      }

      const response = await axios.request(config)

      return {
        status: response.status,
        headers: response.headers as HttpHeaders,
        body: response.data,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        /* Response */
        console.log('[HttpClient#sendRequest] response status:', error.response?.status)
        console.log('[HttpClient#sendRequest] response body:', error.response?.data)
        console.log('[HttpClient#sendRequest] response headers:', error.response?.headers)

        /* Request */
        console.log('[HttpClient#sendRequest] requestConfig headers:', error.config?.headers)
        console.log('[HttpClient#sendRequest] requestConfig params:', error.config?.params)
        console.log('[HttpClient#sendRequest] requestConfig method:', error.config?.method)
        console.log('[HttpClient#sendRequest] requestConfig url:', error.config?.url)
        console.log('[HttpClient#sendRequest] requestConfig data:', error.config?.data)
        throw new HttpError(request.body, error)
      } else {
        console.log('[HttpClient#sendRequest] error:', error)
      }

      throw error
    }
  }

  private getAxiosRequestMethod(httpMethod: HttpMethod): string {
    return httpMethod.toString()
  }
}
