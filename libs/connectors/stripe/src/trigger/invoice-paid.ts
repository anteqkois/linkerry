import { createTrigger } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'
import { stripeCommon } from '../common'
import { stripeAuth } from '../common/auth'

export const stripeInvoicePaid = createTrigger({
  auth: stripeAuth,
  name: 'invoice_paid',
  displayName: 'Invoice Paid',
  description: 'Trigger an action when an invoice was paid through Stripe',
  descriptionLong:
    'This feature triggers an action whenever an invoice was paid through Stripe. Users can use this to automate workflows, such as updating financial records or sending payment confirmation emails. It helps ensure that all payment-related activities are tracked and managed efficiently.',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    id: 'in_234ZIQLG9PNxhgtNJF0KobW3',
    object: 'invoice',
    account_country: 'PL',
    account_name: 'Test Sp. Z.O.O.',
    account_tax_ids: null,
    amount_due: 2000,
    amount_paid: 2000,
    amount_remaining: 0,
    amount_shipping: 0,
    application: null,
    application_fee_amount: null,
    attempt_count: 1,
    attempted: true,
    auto_advance: false,
    automatic_tax: {
      enabled: false,
      liability: null,
      status: null,
    },
    automatically_finalizes_at: null,
    billing_reason: 'subscription_create',
    charge: 'ch_bj*ZIQLG9PNxhgtN1DZSwdWD',
    collection_method: 'charge_automatically',
    created: 1721228254,
    currency: 'usd',
    custom_fields: null,
    customer: 'cus_0JAdTsiKM23HH5',
    customer_address: {
      city: null,
      country: 'PL',
      line1: null,
      line2: null,
      postal_code: null,
      state: null,
    },
    customer_email: 'test.linkerry@gmail.com',
    customer_name: 'Company name',
    customer_phone: null,
    customer_shipping: null,
    customer_tax_exempt: 'none',
    customer_tax_ids: [],
    default_payment_method: null,
    default_source: null,
    default_tax_rates: [],
    description: null,
    discount: null,
    discounts: [],
    due_date: null,
    effective_at: 1721228254,
    ending_balance: 0,
    footer: null,
    from_invoice: null,
    hosted_invoice_url:
      'https://invoice.stripe.com/i/acct_2P2Fd5LqwPNxh2t4/live_YWNjdFdeUDJGdTVMRzlCDnhoZ3ROLF9RVVlQZDY3Z223T0NUcE9PRWExcEvgcFhvQlFOWVNFLDEdeTc2OTIwNg0200xZaRtE77?s=ap',
    invoice_pdf:
      'https://pay.stripe.com/invoice/acct_122F35LG9PvfhgtN/live_YWNjdFdeUDJGdTVMRzlCDnhoZ3ROLF9RVVlQZDY3Z223T0NUcE9PRWExcEvgcFhvQlFOWVNFLDEdeTc2OTIwNg0200xZaRtE77/pdf?s=ap',
    issuer: {
      type: 'self',
    },
    last_finalization_error: null,
    latest_revision: null,
    lines: {
      object: 'list',
      data: [
        {
          id: 'il_1PXDIQLG9BJxhgtN7cP4qzKe',
          object: 'line_item',
          amount: 2000,
          amount_excluding_tax: 2000,
          currency: 'usd',
          description: '1 × product',
          discount_amounts: [],
          discountable: true,
          discounts: [],
          invoice: 'in_1PdZCDLG9PNdegtNJF2LebW3',
          livemode: true,
          metadata: {},
          period: {
            end: 1723906654,
            start: 1721228254,
          },
          plan: {
            id: 'price_5P63YnCD9PNx23tNdM7ScPqa',
            object: 'plan',
            active: true,
            aggregate_usage: null,
            amount: 2000,
            amount_decimal: '2000',
            billing_scheme: 'per_unit',
            created: 1713418261,
            currency: 'usd',
            interval: 'month',
            interval_count: 1,
            livemode: true,
            metadata: {},
            meter: null,
            nickname: null,
            product: 'prod_stcdfxNX2pOw4G',
            tiers_mode: null,
            transform_usage: null,
            trial_period_days: null,
            usage_type: 'licensed',
          },
          price: {
            id: 'price_5P63YnCD9PNx23tNdM7ScPqa',
            object: 'price',
            active: true,
            billing_scheme: 'per_unit',
            created: 1713418261,
            currency: 'usd',
            custom_unit_amount: null,
            livemode: true,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: 'prod_stcdfxNX2pOw4G',
            recurring: {
              aggregate_usage: null,
              interval: 'month',
              interval_count: 1,
              meter: null,
              trial_period_days: null,
              usage_type: 'licensed',
            },
            tax_behavior: 'inclusive',
            tiers_mode: null,
            transform_quantity: null,
            type: 'recurring',
            unit_amount: 2000,
            unit_amount_decimal: '2000',
          },
          proration: false,
          proration_details: {
            credited_items: null,
          },
          quantity: 1,
          subscription: 'sub_2vdZIQLDCPNxhgt12CisJCDd',
          subscription_item: 'si_CDYP9264cv12tN',
          tax_amounts: [],
          tax_rates: [],
          type: 'subscription',
          unit_amount_excluding_tax: '2000',
        },
      ],
      has_more: false,
      total_count: 1,
      url: '/v1/invoices/in_1PPIp3RrVCVQQnSuEuawxtHQ/lines',
    },
    livemode: true,
    metadata: {},
    next_payment_attempt: null,
    number: '43269AD2-1280',
    on_behalf_of: null,
    paid: true,
    paid_out_of_band: false,
    payment_intent: 'pi_123ZIQcds9PNxhgtN1cQUUJbT',
    payment_settings: {
      default_mandate: null,
      payment_method_options: null,
      payment_method_types: null,
    },
    period_end: 1721228254,
    period_start: 1721228254,
    post_payment_credit_notes_amount: 0,
    pre_payment_credit_notes_amount: 0,
    quote: null,
    receipt_number: null,
    rendering: null,
    rendering_options: null,
    shipping_cost: null,
    shipping_details: null,
    starting_balance: 0,
    statement_descriptor: null,
    status: 'paid',
    status_transitions: {
      finalized_at: 1721228254,
      marked_uncollectible_at: null,
      paid_at: 1721228405,
      voided_at: null,
    },
    subscription: 'sub_2vdZIQLDCPNxhgt12CisJCDd',
    subscription_details: {},
    subtotal: 2000,
    subtotal_excluding_tax: 2000,
    tax: null,
    test_clock: null,
    total: 2000,
    total_discount_amounts: [],
    total_excluding_tax: 2000,
    total_tax_amounts: [],
    transfer_data: null,
    webhooks_delivered_at: 1721228254,
  },
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook('invoice.paid', context.webhookUrl!, context.auth)
    await context.store?.put<WebhookInformation>('_invoice_paid', {
      webhookId: webhook.id,
    })
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_invoice_paid')
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
