import { ConnectorAuth } from "@linkerry/connectors-framework";

export const stripeAuth = ConnectorAuth.SecretText({
  displayName: 'Secret API Key',
  required: true,
  description: 'Secret key acquired from your [Stripe API dashboard](https://dashboard.stripe.com/apikeys)',
});
