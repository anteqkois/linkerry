import { exchangeCommon } from '@linkerry/common-exchanges'
import { Property, createAction } from '@linkerry/connectors-framework'
import { binanceAuth } from '../common/auth'
import { BinanceClient } from '../common/client'

export const createOrderAdvanced = createAction({
  auth: binanceAuth,
  displayName: 'Create Advanced Order',
  description: 'Create a trade order with options like stoploss, profit etc.',
  name: 'create_order',
  props: {
    symbol: exchangeCommon.symbol(BinanceClient),
    type: Property.StaticDropdown({
      displayName: 'Type',
      description: 'Order type to make',
      required: true,
      options: {
        options: [
          {
            label: 'Market',
            value: 'market',
          },
          {
            label: 'Limit',
            value: 'limit',
          },
          {
            label: 'Stop Loss',
            value: 'STOP_LOSS',
          },
          {
            label: 'Stop Loss Limit',
            value: 'STOP_LOSS_LIMIT',
          },
          {
            label: 'Take Profit',
            value: 'TAKE_PROFIT',
          },
          {
            label: 'Take Profit Limit',
            value: 'TAKE_PROFIT_LIMIT',
          },
          {
            label: 'Stop',
            value: 'STOP',
          },
        ],
      },
      defaultValue: 'market',
    }),
    side: exchangeCommon.side,
    amount: exchangeCommon.amount,
    price: exchangeCommon.price(),
    margin_mode: exchangeCommon.margin_mode({
      required: false,
    }),
    stop_loss_price: Property.Number({
      displayName: 'Stop Loss Price',
      description: 'The price that a stop loss order is triggered at',
      required: false,
    }),
    take_profit_price: Property.Number({
      displayName: 'Take Profit Price',
      description: 'The price that a take profit order is triggered at',
      required: false,
    }),
  },
  run: async ({ auth, propsValue }) => {
    // TODO finish
    // exchangeClient.setAuth(auth)

    // const response = await exchangeClient.exchange.createOrder(
    //   propsValue.symbol,
    //   propsValue.type,
    //   propsValue.side,
    //   propsValue.amount,
    //   propsValue.price,
    // )

    // return response
  },
})
