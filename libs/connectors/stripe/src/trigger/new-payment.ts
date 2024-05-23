import { createTrigger } from '@linkerry/connectors-framework'
import { stripeAuth } from '../common/auth'
import { stripeCommon } from '../common'
import { TriggerStrategy } from '@linkerry/shared'

export const stripeNewPayment = createTrigger({
  auth: stripeAuth,
  name: 'new_payment',
  displayName: 'New Payment',
  description: 'Triggers when a new payment is made',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    id: 'ch_6d5M7gKZ2zZRdLgh1sasKArS',
    object: 'charge',
    amount: 10000,
    amount_captured: 10000,
    amount_refunded: 0,
    application: null,
    application_fee: null,
    application_fee_amount: null,
    balance_transaction: 'txn_AMcdM71KZ0dZRqLEK1VyE8dHGG',
    billing_details: {
      address: {
        city: null,
        country: 'PL',
        line1: null,
        line2: null,
        postal_code: null,
        state: null,
      },
      email: 'test.linkerry@gmail.com',
      name: 'Test linkerry user',
      phone: null,
    },
    calculated_statement_descriptor: 'WWW.LINKERRY.COM',
    captured: true,
    created: 1675180355,
    currency: 'usd',
    customer: 'cus_HY2vSQ1vfJsaGI',
    description: 'Subscription creation',
    destination: null,
    dispute: null,
    disputed: false,
    failure_balance_transaction: null,
    failure_code: null,
    failure_message: null,
    fraud_details: {},
    invoice: 'in_1MJG&ZKZ0dsaxLEKQbrgSBnh',
    livemode: false,
    metadata: {},
    on_behalf_of: null,
    order: null,
    outcome: {
      network_status: 'approved_by_network',
      reason: null,
      risk_level: 'normal',
      risk_score: 64,
      seller_message: 'Payment complete.',
      type: 'authorized',
    },
    paid: true,
    payment_intent: 'pi_cdWMSSKZa4ZRvf2K1BsdlcVI',
    payment_method: 'pm_K83M8MKZ023daqLEKnbhw1f76',
    payment_method_details: {
      card: {
        brand: 'visa',
        checks: {
          address_line1_check: null,
          address_postal_code_check: null,
          cvc_check: 'pass',
        },
        country: 'US',
        exp_month: 12,
        exp_year: 2034,
        fingerprint: 'jhg3smS4jhd7sDpN',
        funding: 'credit',
        installments: null,
        last4: '4242',
        mandate: null,
        network: 'visa',
        three_d_secure: null,
        wallet: null,
      },
      type: 'card',
    },
    receipt_email: null,
    receipt_number: null,
    receipt_url:
      'https://pay.stripe.com/receipts/invoices/CAcaFwoVYWNjdF8xS214ZEtLWjBkWlJxTEVLKMXy5J4GMgZcuppYWF06LBZEoiAhZ6H7EoJ3bN-BMHCXdaW-_i-ywhSIG9wPGTmtE0CdpD75s1hIyprK?s=ap',
    refunded: false,
    refunds: {
      object: 'list',
      data: [],
      has_more: false,
      total_count: 0,
      url: '/v1/charges/ch_6d5M7gKZ2zZRdLgh1sasKArS/refunds',
    },
    review: null,
    shipping: null,
    source: null,
    source_transfer: null,
    statement_descriptor: null,
    statement_descriptor_suffix: null,
    status: 'succeeded',
    transfer_data: null,
    transfer_group: null,
  },
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook('charge.succeeded', context.webhookUrl!, context.auth)
    await context.store?.put<WebhookInformation>('_new_payment_trigger', {
      webhookId: webhook.id,
    })
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_new_payment_trigger')
    if (response !== null && response !== undefined) {
      await stripeCommon.unsubscribeWebhook(response.webhookId, context.auth)
    }
  },
  async run(context) {
    const payloadBody = context.payload.body as PayloadBody
    return [payloadBody.data.object]
  },
})

type PayloadBody = {
  data: {
    object: unknown
  }
}

interface WebhookInformation {
  webhookId: string
}
