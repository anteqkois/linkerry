import axios from 'axios'
import { login } from '../support/login'
import { CustomHttpExceptionResponse, IAlertInput } from '@market-connector/types'

describe('POST /api/alerts', () => {
  it('Preperly create error schema for missing data', async () => {
    const input: Partial<IAlertInput> = {
      testMode: true,
      // name: 'test alert 2',
      active: true,
      alertValidityUnix: 389721,
      symbol: 'BTC',
    }
    await login()

    try {
      const res = await axios.post(`/alerts`, input)
    } catch (error: any) {
      const errorResponse = error.response.data as CustomHttpExceptionResponse
      expect(errorResponse.statusCode).toBe(422)
      expect(errorResponse.code).toBe('DtoException')
      expect(errorResponse.message).toBeDefined()
      expect(errorResponse.error).toBeDefined()
      expect(errorResponse.path).toBe('/api/alerts')
      expect(errorResponse.method).toBe('POST')
      expect(errorResponse.timestamp).toBeDefined
    }
  })
})
