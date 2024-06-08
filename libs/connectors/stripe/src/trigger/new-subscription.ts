import { createTrigger } from '@linkerry/connectors-framework'
import { TriggerStrategy } from '@linkerry/shared'
import { stripeCommon } from '../common'
import { stripeAuth } from '../common/auth'

export const stripeNewSubscription = createTrigger({
  auth: stripeAuth,
  name: 'new_subscription',
  displayName: 'New Subscription',
  description: 'Trigger an action when a new subscription is created in Stripe',
  descriptionLong: 'This feature triggers an action whenever a new subscription is created in Stripe. Users can use this to automate workflows like updating subscription records, issuing welcome emails, or managing customer accounts. It ensures all subscription-related activities are promptly tracked and managed.',
  props: {},
  type: TriggerStrategy.WEBHOOK,
  sampleData: {
    id: 'sub_1PFKedRrVCVQQnSuOutmsBkG',
    object: 'subscription',
    application: null,
    application_fee_percent: null,
    automatic_tax: {
      enabled: false,
      liability: null,
    },
    billing_cycle_anchor: 1715452099,
    billing_cycle_anchor_config: null,
    billing_thresholds: null,
    cancel_at: null,
    cancel_at_period_end: false,
    canceled_at: null,
    cancellation_details: {
      comment: null,
      feedback: null,
      reason: null,
    },
    collection_method: 'charge_automatically',
    created: 1715452099,
    currency: 'pln',
    current_period_end: 1718130499,
    current_period_start: 1715452099,
    customer: 'cus_Q5Vey2GuuQYpip',
    days_until_due: null,
    default_payment_method: null,
    default_source: null,
    default_tax_rates: [],
    description: null,
    discount: null,
    discounts: [],
    ended_at: null,
    invoice_settings: {
      account_tax_ids: null,
      issuer: {
        type: 'self',
      },
    },
    items: {
      object: 'list',
      data: [
        {
          id: 'si_Q5VfL7aocfKEQM',
          object: 'subscription_item',
          billing_thresholds: null,
          created: 1715452100,
          discounts: [],
          metadata: {},
          plan: {
            id: 'price_1PFKeFRrVCVQQnSuRVwcOUjQ',
            object: 'plan',
            active: true,
            aggregate_usage: null,
            amount: 0,
            amount_decimal: '0',
            billing_scheme: 'per_unit',
            created: 1715452075,
            currency: 'pln',
            interval: 'month',
            interval_count: 1,
            livemode: true,
            metadata: {},
            meter: null,
            nickname: null,
            product: 'prod_Q5Vf5Umd1cySdl',
            tiers_mode: null,
            transform_usage: null,
            trial_period_days: null,
            usage_type: 'licensed',
          },
          price: {
            id: 'price_1PFKeFRrVCVQQnSuRVwcOUjQ',
            object: 'price',
            active: true,
            billing_scheme: 'per_unit',
            created: 1715452075,
            currency: 'pln',
            custom_unit_amount: null,
            livemode: true,
            lookup_key: null,
            metadata: {},
            nickname: null,
            product: 'prod_Q5Vf5Umd1cySdl',
            recurring: {
              aggregate_usage: null,
              interval: 'month',
              interval_count: 1,
              meter: null,
              trial_period_days: null,
              usage_type: 'licensed',
            },
            tax_behavior: 'unspecified',
            tiers_mode: null,
            transform_quantity: null,
            type: 'recurring',
            unit_amount: 0,
            unit_amount_decimal: '0',
          },
          quantity: 1,
          subscription: 'sub_1PFKedRrVCVQQnSuOutmsBkG',
          tax_rates: [],
        },
      ],
      has_more: false,
      total_count: 1,
      url: '/v1/subscription_items?subscription=sub_1PFKedRrVCVQQnSuOutmsBkG',
    },
    latest_invoice: 'in_1PFKedRrVCVQQnSuxKlCFbWr',
    livemode: true,
    metadata: {},
    next_pending_invoice_item_invoice: null,
    on_behalf_of: null,
    pause_collection: null,
    payment_settings: {
      payment_method_options: null,
      payment_method_types: null,
      save_default_payment_method: 'off',
    },
    pending_invoice_item_interval: null,
    pending_setup_intent: 'seti_1PFKeeRrVCVQQnSuEm02VDaz',
    pending_update: null,
    plan: {
      id: 'price_1PFKeFRrVCVQQnSuRVwcOUjQ',
      object: 'plan',
      active: true,
      aggregate_usage: null,
      amount: 20000,
      amount_decimal: '20000',
      billing_scheme: 'per_unit',
      created: 1715452075,
      currency: 'pln',
      interval: 'month',
      interval_count: 1,
      livemode: true,
      metadata: {},
      meter: null,
      nickname: null,
      product: 'prod_Q5Vf5Umd1cySdl',
      tiers_mode: null,
      transform_usage: null,
      trial_period_days: null,
      usage_type: 'licensed',
    },
    quantity: 1,
    schedule: null,
    start_date: 1715452099,
    status: 'active',
    test_clock: null,
    transfer_data: null,
    trial_end: null,
    trial_settings: {
      end_behavior: {
        missing_payment_method: 'create_invoice',
      },
    },
    trial_start: null,
  },
  async onEnable(context) {
    const webhook = await stripeCommon.subscribeWebhook('customer.subscription.created', context.webhookUrl!, context.auth)
    await context.store?.put<WebhookInformation>('_new_customer_subscription_trigger', {
      webhookId: webhook.id,
    })
  },
  async onDisable(context) {
    const response = await context.store?.get<WebhookInformation>('_new_customer_subscription_trigger')
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
