import { ConnectorAuth } from '@linkerry/connectors-framework'
import { HttpStatusCode, isAxiosError } from 'axios'
import { CoingeckoApi } from './api'

const markdownDescription = `**Authentication**:

You can follow this **[Coingecko article link](https://support.coingecko.com/hc/en-us/articles/21880397454233-User-Guide-How-to-sign-up-for-CoinGecko-Demo-API-and-generate-an-API-key)** to obtain **free** demo API key.
If the link not exists, search in the browser "coingecko how to obtain free API keys"`

export const coingeckoAuth = ConnectorAuth.SecretText({
  displayName: 'Demo API Key',
  description: markdownDescription,
  required: true,
  validate: async ({ auth }) => {
    try {
      const { body } = await CoingeckoApi.ping({ auth })

      if (body.gecko_says)
        return {
          valid: true,
        }
      else
        return {
          valid: true,
          error: 'Invalid Coingecko API Key',
        }
    } catch (error: any) {
      if (isAxiosError(error)) {
        if (error.status === HttpStatusCode.NotFound)
          return {
            valid: false,
            error: 'Invalid Coingecko API Key',
          }
        else
          return {
            valid: false,
            error: error.response?.data?.description,
          }
      }

      return {
        valid: false,
        error: error?.message,
      }
    }
  },
})
