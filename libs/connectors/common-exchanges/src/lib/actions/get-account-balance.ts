import { createAction } from '@linkerry/connectors-framework'
import { ExchangeClientInterface } from '../types'

export const getAccountBalanceActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth: auth,
    description: 'Get Account Asset Balance',
    displayName: 'Get account balance',
    name: 'get_account_balance',
    props: {},
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.fetchBalance()
      return response
    },
  })
