import { Property, createAction } from '@linkerry/connectors-framework'
import { ExchangeClientInterface } from '../types'

export const setMarginModeActionFactory = (exchangeClient: ExchangeClientInterface, auth: any) =>
  createAction({
    auth,
    displayName: 'Set Margin Mode',
    description: 'Set margin mode to "cross" or "isolated"',
    name: 'set_margin_mode',
    props: {
      margin_mode: Property.StaticDropdown({
        displayName: 'Mode',
        required: true,
        options: {
          options: [
            {
              label: 'Cross',
              value: 'cross',
            },
            {
              label: 'Isolated',
              value: 'isolated',
            },
          ],
        },
        defaultValue: 'cross',
      }),
    },
    run: async ({ auth, propsValue }) => {
      exchangeClient.setAuth(auth)

      const response = await exchangeClient.exchange.setMarginMode(propsValue.margin_mode)
      return response
    },
  })
