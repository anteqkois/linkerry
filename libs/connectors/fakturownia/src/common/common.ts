import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'

interface FakturowaniaAuth {
  domain: string
  api_token: string
}

export const fakturowniaCommons = {
  getApiUrl: (domain: string, endpoint: string) => {
    return `https://${domain}.fakturownia.pl/${endpoint}`
  },
  getInvoices: async ({ api_token, domain }: FakturowaniaAuth) => {
    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: fakturowniaCommons.getApiUrl(domain, 'invoices.json'),
      queryParams:{
        api_token,
      },
    }

    return httpClient.sendRequest(request)
  },
  // subscribeWebhook: async (botToken: string, webhookUrl: string, overrides?: Partial<SetWebhookRequest>) => {},
}
