import {
  IStrategyBuy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_CreateInput,
  StrategyBuyType,
  StrategyType,
} from '@market-connector/types'
import { ZodSchema, z } from 'zod'
import { mongoIdSchema } from '../../libs/zod'

export const strategyStaticMarketSchema: ZodSchema<IStrategy_StaticMarket_CreateInput> = z.object({
  type: z.nativeEnum(StrategyType, { invalid_type_error: 'Invalid strategytype' }),
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

export const strategyBuyStaticMarketSchema: ZodSchema<IStrategyBuy_StaticMarket_CreateInput> = z.object({
  type: z.nativeEnum(StrategyBuyType, { invalid_type_error: 'Invalid strategy buy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  conditions: z.array(z.object({ id: mongoIdSchema, active: z.boolean(), condition: mongoIdSchema })),
})
