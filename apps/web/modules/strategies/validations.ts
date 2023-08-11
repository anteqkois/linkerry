import {
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_UpdateInput,
  StrategyState,
  StrategyType,
} from '@market-connector/types'
import { ZodSchema, z } from 'zod'
import { mongoIdSchema } from '../../libs/zod'

export const StrategyStaticMarketCreateSchema: ZodSchema<IStrategy_StaticMarket_CreateInput> = z.object({
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
