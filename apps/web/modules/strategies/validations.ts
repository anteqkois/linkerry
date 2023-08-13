import {
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategyBuy_StaticMarket_UpdateInput,
  IStrategyBuy_UpdateInput,
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_UpdateInput,
  StrategyBuyType,
  StrategyState,
  StrategyType,
} from '@market-connector/types'
import { ZodSchema, z } from 'zod'
import { mongoIdSchema } from '../../libs/zod'

// Strategy
export const StrategyStaticMarketCreateSchema: ZodSchema<IStrategy_StaticMarket_CreateInput> = z.object({
  type: z.nativeEnum(StrategyType, { invalid_type_error: 'Invalid Strategy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  testMode: z.boolean(),
  active: z.boolean(),
  strategyBuy: z.array(z.object({ id: mongoIdSchema, active: z.boolean(), strategyBuy: mongoIdSchema })),
})

export const StrategyStaticMarketUpdateSchema: ZodSchema<IStrategy_StaticMarket_UpdateInput> = z.object({
  validityUnix: z.number(),
  triggeredTimes: z.number(),
  state: z.nativeEnum(StrategyState, { invalid_type_error: 'Invalid strategy state' }),
  type: z.nativeEnum(StrategyType, { invalid_type_error: 'Invalid strategy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  testMode: z.boolean(),
  active: z.boolean(),
  strategyBuy: z.array(z.object({ id: mongoIdSchema, active: z.boolean(), strategyBuy: mongoIdSchema })),
})

// Strategy Buy
export const StrategyBuyCreateStaticMarketSchema: ZodSchema<IStrategyBuy_StaticMarket_CreateInput> = z.object({
  type: z.nativeEnum(StrategyBuyType, { invalid_type_error: 'Invalid strategy buy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  conditions: z.array(z.object({ id: mongoIdSchema, active: z.boolean(), condition: mongoIdSchema })),
})

export const StrategyBuyUpdateStaticMarketSchema: ZodSchema<IStrategyBuy_UpdateInput> = z.object({
  // Dynamic Market
  conditionMarketProvider: mongoIdSchema.optional(),
  // Static Market
  // ...
  // Common
  validityUnix: z.number(),
  triggeredTimes: z.number(),
  type: z.nativeEnum(StrategyBuyType, { invalid_type_error: 'Invalid strategy buy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  conditions: z.array(z.object({ id: mongoIdSchema, active: z.boolean(), condition: mongoIdSchema })),
})
