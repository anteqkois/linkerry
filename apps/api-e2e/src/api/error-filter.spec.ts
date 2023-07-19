import { Alert, AlertProvidersType, CreateAlertDto, Condition, ConditionTypeType, ConditionOperatorType } from '@market-connector/core'
import axios from 'axios'
import { login } from '../support/login'

describe.skip('POST /api/alerts', () => {
  it('test error filter', async () => {
    await login()
    const input: CreateAlertDto = {
      alertProvider: AlertProvidersType.TRADING_VIEW,
      testMode: true,
      name: 'alert should pass test',
      active: true,
      alertValidityUnix: 389721,
      ticker: 'BTC'
    }
    const res = await axios.post(`/alerts`, input)

    try {
      const res1 = await axios.post(`/alerts`, input)
    } catch (error: any) {
      // console.log(error.response);
      console.log(error.response.data);
    }
  })

  it('can\'t create alert with missing data', async () => {
    const input: Partial<CreateAlertDto> = {
      testMode: true,
      // name: 'test alert 2',
      active: true,
      alertValidityUnix: 389721,
      ticker: 'BTC',
    }


    try {
      const res = await axios.post(`/alerts`, input)
    } catch (error: any) {
      // console.log(error.response);
      console.log(error.response.data);
    }
  })
})
