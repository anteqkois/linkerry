import { HttpMethod, HttpRequest, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { faktorowniaAuth } from '../common/auth'
import { fakturowniaCommons } from '../common/common'

export const fakturowniaCreateInvoice = createAction({
  auth: faktorowniaAuth,
  name: 'create_invoice',
  displayName: 'Create Invoice',
  description: 'Create professional invoices effortlessly with Fakturownia, enabling business transactions to be smooth and organized.',
  descriptionLong:
    'The "Create Invoice" feature in Fakturownia helps you generate professional invoices quickly and effortlessly. This feature not only streamlines the billing process but also ensures that all necessary details are accurately captured, from seller and buyer information to specific product details, thereby making transactions smooth and transparent. You can specify the type of invoice you\'re generating, assign a unique invoice number, and set both the sell date and issue date. Additionally, Fakturownia allows you to add seller and buyer information, including their tax numbers, ensuring compliance with tax regulations. Automating the creation of invoices saves time, reduces errors, and keeps your business organized.',
  props: {
    kind: Property.StaticDropdown({
      displayName: 'Kind',
      required: true,
      defaultValue: 'vat',
      description: 'Invoice kind',
      options: {
        options: [
          {
            label: 'vat',
            value: 'vat',
          },
        ],
      },
    }),
    number: Property.Number({
      displayName: 'Number',
      description: "Invoice number, if you don't specify any number, default value will be used",
      required: false,
    }),
    sell_date: Property.DateTime({
      displayName: 'Sell Date',
      description: 'If not provided, date when action runs will be used',
      required: false,
    }),
    issue_date: Property.DateTime({
      displayName: 'Issue Date',
      description: 'If not provided, date when action runs will be used',
      required: false,
    }),
    // payment_to: '2013-01-23',
    payment_extension_days: Property.Number({
      displayName: 'Payment Extension Days',
      description: 'Number of days to add to the Issue Date. This date will be used as the Payment Due Date.',
      required: false,
      defaultValue: 30,
    }),
    seller_name: Property.ShortText({
      displayName: 'Seller Name',
      description: 'Enter the name of the seller issuing the invoice.',
      required: true,
    }),
    seller_tax_no: Property.ShortText({
      displayName: 'Seller Tax No',
      description: 'Provide the tax identification number for the seller.',
      required: true,
    }),
    buyer_name: Property.ShortText({
      displayName: 'Buyer Name',
      description: 'The name of the buyer who will receive the invoice.',
      required: true,
    }),
    buyer_email: Property.ShortText({
      displayName: 'Buyer Email',
      description: 'Enter the email address of the buyer to send the invoice.',
      required: true,
    }),
    buyer_tax_no: Property.ShortText({
      displayName: 'Buyer Tax No',
      description: 'Provide the tax identification number for the buyer to ensure tax compliance.',
      required: true,
    }),
    products: Property.Array({
      displayName: 'Products',
      description: 'List the products or services being invoiced, including descriptions, quantities, and prices.',
      required: true,
      properties: {
        name: Property.ShortText({
          displayName: 'Name',
          description: 'Specify the name of each product or service being invoiced.',
          required: true,
        }),
        tax: Property.Number({
          displayName: 'tax',
          description: 'Indicate the tax rate applicable to each product or service for accurate tax calculation.',
          required: false,
          defaultValue: 23,
        }),
        total_price_gross: Property.Number({
          displayName: 'Total Price Gross',
          description: 'Enter the total gross price of each product or service before any discounts.',
          required: true,
        }),
        quantity: Property.Number({
          displayName: 'Quantity',
          description: 'Specify the quantity of each product sold or service provided, ensuring proper billing.',
          required: true,
        }),
      },
    }),
  },
  async run({ auth, propsValue }) {
    const nowDate = new Date()
    const invoiceNumber = propsValue.number || Math.round(nowDate.getTime() / 1000)
    const sell_date = propsValue.sell_date || nowDate.toISOString().slice(0, 10)
    const issue_date = propsValue.issue_date || nowDate.toISOString().slice(0, 10)
    const payment_to = new Date(new Date(issue_date).setDate(new Date(issue_date).getDate() + 10)).toISOString().slice(0, 10)

    const request: HttpRequest = {
      method: HttpMethod.POST,
      url: fakturowniaCommons.getApiUrl(auth.domain, 'invoices.json'),
      body: {
        api_token: auth.api_token,
        invoice: {
          kind: propsValue.kind,
          number: invoiceNumber,
          sell_date: sell_date,
          issue_date: issue_date,
          payment_to: payment_to,
          buyer_name: propsValue.buyer_name,
          buyer_tax_no: propsValue.buyer_tax_no,
          positions: propsValue.products,
        },
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
