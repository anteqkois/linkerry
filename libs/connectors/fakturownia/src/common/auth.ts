import { HttpError } from '@linkerry/connectors-common'
import { ConnectorAuth } from '@linkerry/connectors-framework'
import { fakturowniaCommons } from './common'

const authDescription = `**API Key**:

Follow [this tutorial](https://pomoc.fakturownia.pl/150728-Skad-pobrac-kod-autoryzacyjny-API-) to obtain Fakturownia API Key.
Don't forget to also provide your correct subdomain for Fakturowania app.
`

export const faktorowniaAuth = ConnectorAuth.CustomAuth({
  description: authDescription,
  required: true,
  props: {
    api_token: ConnectorAuth.SecretText({
      displayName: 'API Token',
      required: true,
    }),
    domain: ConnectorAuth.SecretText({
      displayName: 'Domain',
      description:
        "Domain for your Fakturownia app. You provide it during the registration process, and you can obtain it from your browser's address bar. It should be in the format: https://<domain>.fakturownia.pl/, so get this <domain> and place here.",
      required: true,
    }),
  },
  validate: async ({ auth }) => {
    try {
      const invoices = await fakturowniaCommons.getInvoices(auth)
      return {
        valid: true,
      }
    } catch (error: any) {
      if (HttpError.isHttpError(error)) {
        return {
          valid: false,
          error: `Invalid API token or domain. Error response: ${error.axiosError.response?.data.message}`,
        }
      }

      return {
        valid: false,
        error: `Invalid API token or domain. Error response: ${error.message}`,
      }
    }
  },
})
