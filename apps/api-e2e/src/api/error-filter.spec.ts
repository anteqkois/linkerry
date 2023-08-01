import { CustomHttpExceptionResponse, IAlertInput } from '@market-connector/types'
import axios from 'axios'
import { login } from '../support/login'

describe('ERROR FILTER', () => {
  it('Preperly create error schema for missing data', async () => {
    const input: Partial<IAlertInput> = {
      testMode: true,
      active: true,
      eventValidityUnix: 389721,
    }
    await login()

    try {
      const res = await axios.post(`/conditions`, input)
    } catch (error: any) {
      const errorResponse = error.response.data as CustomHttpExceptionResponse

      expect(errorResponse.statusCode).toBe(422)
      expect(errorResponse.code).toBe('DtoException')
      expect(errorResponse.message).toBeDefined()
      expect(errorResponse.error).toBeDefined()
      expect(errorResponse.field).toBeDefined()
      expect(errorResponse.path).toBe('/api/conditions')
      expect(errorResponse.method).toBe('POST')
      expect(errorResponse.timestamp).toBeDefined
    }
  })
})
