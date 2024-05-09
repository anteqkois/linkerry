import { z } from 'zod';
import { BaseDatabaseFields } from '../../../common';
import {
  idSchema,
  stringDateSchema,
  stringShortSchema,
} from '../../../common/zod';
import { projectSchema } from '../../project';
import { Price, Product, priceSchema, productSchema } from '../products/models';
import { SubscriptionStatus, SubscriptionPeriod, PaymentGateway } from './enums';

const subscriptionItemSchema = z.object({
  productId: idSchema,
  product: productSchema.optional(),
  priceId: idSchema,
  price: priceSchema.optional(),
});
export type SubscriptionItem = z.infer<typeof subscriptionItemSchema>;

const subscriptionCommonFieldsSchema = z.object({
  projectId: idSchema,
  project: projectSchema.optional(),
  items: z.array(subscriptionItemSchema).min(1).max(10),
  status: z.nativeEnum(SubscriptionStatus),
  validTo: stringDateSchema,
  canceledAt: stringDateSchema.optional(),
  trialStartedAt: stringDateSchema.optional(),
  trialEndedAt: stringDateSchema.optional(),
  period: z.nativeEnum(SubscriptionPeriod),
});
export interface SubscriptionCommonFields
  extends BaseDatabaseFields,
    z.infer<typeof subscriptionCommonFieldsSchema> {}

const subscriptionBlankSchema = subscriptionCommonFieldsSchema.merge(
  z.object({
    paymentGateway: z.enum([PaymentGateway.NONE]),
  })
);
export interface SubscriptionBlank
  extends BaseDatabaseFields,
    z.infer<typeof subscriptionBlankSchema> {}

const subscriptionStripeSchema = subscriptionCommonFieldsSchema.merge(
  z.object({
    paymentGateway: z.enum([PaymentGateway.STRIPE]),
    stripeSubscriptionId: stringShortSchema,
    validTo: stringDateSchema,
    defaultPaymentMethod: z.null().optional(),
  })
);
export interface SubscriptionStripe
  extends BaseDatabaseFields,
    z.infer<typeof subscriptionStripeSchema> {}

export const subscriptionSchema = z.union([
  subscriptionBlankSchema,
  subscriptionStripeSchema,
]);
export type Subscription = z.infer<typeof subscriptionSchema>;
export type SubscriptionPopulated = Omit<
  SubscriptionBlank | SubscriptionStripe,
  'items'
> & {
  items: {
    product: Product;
    price: Price;
  }[];
};
