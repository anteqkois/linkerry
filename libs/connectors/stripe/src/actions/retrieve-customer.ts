import { AuthenticationType, HttpMethod, httpClient } from '@linkerry/connectors-common';
import { Property, createAction } from '@linkerry/connectors-framework';
import { stripeAuth } from '../common/auth';

export const stripeRetrieveCustomer = createAction({
  name: 'retrieve_customer',
  auth: stripeAuth,
  displayName: 'Retrieve Customer',
  description: 'Retrieve a customer in stripe by id',
  props: {
    id: Property.ShortText({
      displayName: 'ID',
      required: true,
    }),
  },
  async run(context) {
    const customer = {
      id: context.propsValue.id,
    };

    const response = await httpClient.sendRequest({
      method: HttpMethod.GET,
      url: `https://api.stripe.com/v1/customers/${customer.id}`,
      authentication: {
        type: AuthenticationType.BEARER_TOKEN,
        token: context.auth,
      },
    });

    return response.body;
  },
});
