import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { removeUndefinedKeys } from '@linkerry/shared'
import { faktorowniaAuth } from '../common/auth'
import { fakturowniaCommons } from '../common/common'

export const fakturowniaSendInvoiceEmail = createAction({
  auth: faktorowniaAuth,
  name: 'send_invoice_email',
  displayName: 'Send Invoice Email',
  description: 'Send invoices to clients effortlessly via email',
  descriptionLong: 'Automate the process of sending invoices directly to their clients via email. By simply entering the invoice ID and the recipient\'s email address, users can ensure that each client receives their invoice promptly without manual intervention. This feature saves time and reduces human error, making the billing process more efficient and reliable. It\'s especially useful for small business owners, freelancers, and accountants who need to manage multiple invoices daily, ensuring that their workflow remains smooth and clients receive prompt payment notifications.',
  props: {
    invoice_id: Property.ShortText({
      displayName: 'Invoice ID',
      description: 'Id of Fakturownia invoice to sned to the email.',
      required: false,
    }),
    email_to: Property.ShortText({
      displayName: 'Email To',
      description: 'If not provided, email from invoice will be used.',
      required: false,
    }),
  },
  async run({ auth, propsValue }) {
    const optionalParams = {
      email_to: propsValue.email_to,
    }

    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: fakturowniaCommons.getApiUrl(auth.domain, `invoices/${propsValue.invoice_id}/send_by_email.json`),
      queryParams: {
        api_token: auth.api_token,
        ...removeUndefinedKeys(optionalParams),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }

    const res = await httpClient.sendRequest(request)

    return {
      body: res.body,
      status: res.status,
    }
  },
})
