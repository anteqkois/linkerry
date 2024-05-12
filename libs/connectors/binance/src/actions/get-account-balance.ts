import { BalanceInfo } from '@linkerry/common-exchanges'
import { Property, createAction } from '@linkerry/connectors-framework'
import { binanceAuth } from '../common/auth'
import { BinanceClient } from '../common/client'

export const getAccountBalance = createAction({
  auth: binanceAuth,
  displayName: 'Get Account Asset Balance',
  description: 'Get account balance',
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
    BinanceClient.setAuth(auth)

    const balanceInfo = (await BinanceClient.exchange.fetchBalance()).info as BalanceInfo

    const balances = propsValue.non_zero_assets
      ? balanceInfo.balances.filter((balance) => {
          return +balance.free !== 0 || +balance.locked !== 0
        })
      : balanceInfo.balances

    if (!balances.length) return 'Empty account balance'

    return balances
  },
})
