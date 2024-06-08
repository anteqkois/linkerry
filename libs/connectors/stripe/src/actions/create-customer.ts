import { HttpMethod, httpClient } from '@linkerry/connectors-common'
import { Property, createAction } from '@linkerry/connectors-framework'
import { stripeAuth } from '../common/auth'

export const stripeCreateCustomer = createAction({
  name: 'create_customer',
  auth: stripeAuth,
  displayName: 'Create Customer',
  description: 'Easily add new customers to your Stripe account with detailed information and contact details.',
  descriptionLong:
    'Stripe allows you to add new customers to your Stripe account with ease. By providing detailed information such as email, name, phone number, and address, you can keep your customer database organized and up-to-date. This feature is essential for businesses to manage their customer interactions, streamline billing processes, and enhance customer service. Whether you are running an e-commerce store or a subscription service, creating customers in Stripe helps you maintain accurate records and improve operational efficiency.',
  props: {
    email: Property.ShortText({
      displayName: 'Email',
      description: 'The email address of the customer, used for sending invoices, receipts, and other communications.',
      required: true,
    }),
    name: Property.ShortText({
      displayName: 'Name',
      description: 'The full name of the customer, which helps in personalizing interactions and maintaining accurate records.',
      required: true,
    }),
    description: Property.LongText({
      displayName: 'Description',
      description: 'A brief description of the customer, useful for adding notes or additional context for internal reference.',
      required: false,
    }),
    phone: Property.ShortText({
      displayName: 'Phone',
      description: "The customer's phone number, used for contacting them regarding their purchases or account details.",
      required: false,
    }),
    line1: Property.ShortText({
      displayName: 'Address Line 1',
      required: false,
      description: 'The primary address line of the customer, which is necessary for billing and shipping purposes.',
    }),

    postal_code: Property.ShortText({
      displayName: 'Postal Code',
      description: "The postal code of the customer's address, ensuring accurate and efficient delivery and billing processes.",
      required: false,
    }),
    city: Property.ShortText({
      displayName: 'City',
      description: 'The city where the customer resides, part of the address details required for billing and shipping.',
      required: false,
    }),
    state: Property.ShortText({
      displayName: 'State',
      description: "The state or region of the customer's address, providing more specific location information for various processes.",
      required: false,
    }),
    country: Property.ShortText({
      displayName: 'Country',
      description:
        'The country of the customer, which is essential for determining tax rates, shipping options, and compliance with local regulations.',
      required: false,
    }),
  },
  async run(context) {
    const customer = {
      email: context.propsValue.email,
      name: context.propsValue.name,
      description: context.propsValue.description,
      phone: context.propsValue.phone,
      address: {
        line1: context.propsValue.line1,
        postal_code: context.propsValue.postal_code,
        city: context.propsValue.city,
        state: context.propsValue.state,
        country: context.propsValue.country,
      },
    }
    const response = await httpClient.sendRequest({
      method: HttpMethod.POST,
      url: 'https://api.stripe.com/v1/customers',
      headers: {
        Authorization: 'Bearer ' + context.auth,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: {
        email: customer.email,
        name: customer.name,
        description: customer.description,
        phone: customer.phone,
        address: customer.address,
      },
    })
    return response.body
  },
})
