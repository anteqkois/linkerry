import { DateTimeConfigOverwrite, DynamicDropdownConfigOverwrite, NumberConfigOverwrite, Property } from '@linkerry/connectors-framework'
import { ExchangeClientInterface } from '../types'

export const exchangeCommon = {
  symbol: (exchangeClient: ExchangeClientInterface, overwrite: DynamicDropdownConfigOverwrite<any, string> = {}) =>
    Property.DynamicDropdown<true, string>({
      displayName: 'Symbol',
      description: 'Unified symbol of the market to create an order in',
      required: true,
      refreshOnSearch: true,
      refreshers: [],
      options: async ({ auth }, { searchValue }) => {
        await exchangeClient.exchange.loadMarkets()

        if (!searchValue) {
          return {
            disabled: false,
            options: exchangeClient.exchange.symbols.map((symbol) => ({
              label: symbol,
              value: symbol,
            })),
          }
        }

        const searchValueLowerCase = searchValue.toLowerCase()
        return {
          disabled: false,
          options: exchangeClient.exchange.symbols
            .filter((symbol) => symbol.toLowerCase().includes(searchValueLowerCase))
            .map((symbol) => ({
              label: symbol,
              value: symbol,
            })),
        }
      },
      ...overwrite,
    }),
  timeframe: (exchangeClient: ExchangeClientInterface, overwrite: DynamicDropdownConfigOverwrite<any, string> = {}) =>
    Property.DynamicDropdown<true, string>({
      displayName: 'Timeframe',
      description: 'The length of time each candle represents',
      required: true,
      refreshOnSearch: true,
      refreshers: [],
      options: async ({ auth }, { searchValue }) => {
        // ! orginal [string, string | number][]
        const timeframes = Object.entries(exchangeClient.exchange.timeframes) as [string, string][]

        if (!searchValue) {
          return {
            disabled: false,
            options: timeframes.map((timeframe) => ({
              label: timeframe[0],
              value: timeframe[1],
            })),
          }
        }

        const searchValueLowerCase = searchValue.toLowerCase()
        return {
          disabled: false,
          options: timeframes
            .filter((timeframe) => timeframe[0].toLowerCase().includes(searchValueLowerCase))
            .map((timeframe) => ({
              label: timeframe[0],
              value: timeframe[1],
            })),
        }
      },
      ...overwrite,
    }),
  order_type: Property.StaticDropdown({
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
      ],
    },
    defaultValue: 'market',
  }),
  side: Property.StaticDropdown({
    displayName: 'Trade Action',
    required: true,
    options: {
      options: [
        {
          label: 'Buy',
          value: 'buy',
        },
        {
          label: 'Sell',
          value: 'sell',
        },
      ],
    },
    defaultValue: 'buy',
  }),
  amount: Property.Number({
    displayName: 'Amount',
    description:
      'How much of currency you want to trade in units of base currency. Remember about restrictions such as minimum order quantity, price etc.',
    required: true,
  }),
  price: (overwrite: NumberConfigOverwrite = {}) =>
    Property.Number({
      displayName: 'Price',
      description: 'The price at which the order is to be fullfilled, in units of the quote currency, ignored in market orders',
      required: true,
      ...overwrite,
    }),
  cost: Property.Number({
    displayName: 'Cost',
    description: 'The amount you want to trade in units of the quote currency',
    required: true,
  }),
  order_id: Property.ShortText({
    displayName: 'Order Id',
    required: true,
  }),
  since_date: (overwrite: DateTimeConfigOverwrite = {}) =>
    Property.DateTime({
      displayName: 'Since',
      description: 'Date time of the earliest trade to fetch',
      required: true,
      ...overwrite,
    }),
}
