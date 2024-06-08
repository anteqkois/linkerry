/* eslint-disable @nx/enforce-module-boundaries */
import { HttpMethod, httpClient } from '../../common/src/lib/http';

const authToken = process.env.STRIPE_TEST_TOKEN

const getStripeCustomer = async ({ emial, id }: { id?: string; emial?: string; expands?: string[] }) => {
  if (id) {
    const data = httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://api.stripe.com/v1/customers/${id}`,
      queryParams: {
        expand: ['tax_ids', 'subscriptions'],
      },
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    })
    return data
  } else if (emial) {
    const { body } = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://api.stripe.com/v1/customers?email=${emial}`,
      // queryParams: {
      //   expand: ['tax_ids', 'subscriptions'],
      // },
      headers: {
        Authorization: 'Bearer ' + authToken,
      },
    })
    return body?.data[0]
  }
}

const main = async () => {
  // const customer = await getStripeCustomer({ id: 'cus_QFFSK6jOPU2mMp' })
  const customer = await getStripeCustomer({ emial: 'anteqkois@gmail.com' })
  // const customer = await getStripeCustomer({ emial: 'anteqkois@gmail.com' })
  console.dir(customer, { depth: null })

  process.exit(0)
}

main()
  .then()
  .catch((err) => console.log(err))
