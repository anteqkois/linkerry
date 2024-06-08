import { createTrigger } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'
import { stripeCommon } from '../common'
import { stripeAuth } from '../common/auth'

export const stripeNewPayment = createTrigger({
  auth: stripeAuth,
  name: 'new_payment',
  displayName: 'New Payment',
  description: 'Trigger an action when a new payment is made in Stripe',
  descriptionLong:
    'This feature triggers an action whenever a new payment is made in Stripe. Users can use this to automate workflows, such as updating financial records or sending payment confirmation emails. It helps ensure that all payment-related activities are tracked and managed efficiently.',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    id: 'ch_3PPIp4RrVCVQQnSu16Jnc6Ej',
    object: 'charge',
    amount: 1400,
    amount_captured: 1400,
    amount_refunded: 0,
    application: null,
    application_fee: null,
    application_fee_amount: null,
    balance_transaction: 'txn_3PPIp4RrVCVQQnSu1r0Uzt16',
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
      name: 'Test user',
      phone: null,
    },
    calculated_statement_descriptor: 'LINKERRY.COM',
    captured: true,
    created: 1717828338,
    currency: 'usd',
    customer: 'cus_KIFSK62OPU2mZa',
    description: 'Subscription creation',
    destination: null,
    dispute: null,
    disputed: false,
    failure_balance_transaction: null,
    failure_code: null,
    failure_message: null,
    invoice: 'in_1PPIp3RrVCVQQnSuEuawxtHQ',
    livemode: false,
    on_behalf_of: null,
    order: null,
    outcome: {
      network_status: 'approved_by_network',
      reason: null,
      risk_level: 'normal',
      risk_score: 51,
      seller_message: 'Payment complete.',
      type: 'authorized',
    },
    paid: true,
    payment_intent: 'pi_3PPIp4RrVCVQQnSu1HgxH0dd',
    payment_method: 'pm_1PPIp2RrVCVQQnSuFLBZgi8u',
    payment_method_details: {
      card: {
        amount_authorized: 1400,
        brand: 'visa',
        checks: {
          address_line1_check: null,
          address_postal_code_check: null,
          cvc_check: 'pass',
        },
        country: 'US',
        exp_month: 5,
        exp_year: 2043,
        extended_authorization: {
          status: 'disabled',
        },
        fingerprint: 'MkRDDwh288plyHnm',
        funding: 'credit',
        incremental_authorization: {
          status: 'unavailable',
        },
        installments: null,
        last4: '4242',
        mandate: null,
        multicapture: {
          status: 'unavailable',
        },
        network: 'visa',
        network_token: {
          used: false,
        },
        overcapture: {
          maximum_amount_capturable: 1400,
          status: 'unavailable',
        },
        three_d_secure: null,
        wallet: null,
      },
      type: 'card',
    },
    receipt_email: null,
    receipt_number: null,
    receipt_url:
      'https://pay.stripe.com/receipts/invoices/DBHAFwoVYWNjdF86723NNVHhScl98HlFRblN1KPT1j7MGMgaJ9bhsBpM6LBaXPq91-TQd9R4mfwefmA4gjL3124if-a7JMgGwVs6hRI8scVMQ5gQdwedohl?s=ax',
    refunded: false,
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
