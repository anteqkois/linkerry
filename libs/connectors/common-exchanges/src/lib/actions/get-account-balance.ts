import { Property, createAction } from '@linkerry/connectors-framework'
import { exchangeAuth } from '../common/auth'
import { BalanceInfo, ExchangeClientInterface } from '../types'

export const getAccountBalanceActionFactory = (exchangeClient: ExchangeClientInterface, auth: ReturnType<typeof exchangeAuth>) =>
  createAction({
    auth: auth,
    description: 'Get Account Asset Balance',
    displayName: 'Get account balance',
    name: 'get_account_balance',
    props: {
      non_zero_assets: Property.Checkbox({
        description: 'Shoould return only non-zero balance assets',
        displayName: 'Only non-zero assets',
        required: true,
        defaultValue: true,
      }),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const balanceInfo = (await exchangeClient.exchange.fetchBalance()).info as BalanceInfo

      const balances = propsValue.non_zero_assets
        ? balanceInfo.balances.filter((balance) => {
            return +balance.free !== 0 || +balance.locked !== 0
          })
        : balanceInfo.balances

      if (!balances.length) return 'Empty account balance'

      return balances
    }
  })
