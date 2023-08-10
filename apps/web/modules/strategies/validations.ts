import {
  IStrategy_StaticMarket_CreateInput,
  StrategyType,
} from '@market-connector/types'
import { ZodSchema, z } from 'zod'
import { mongoIdSchema } from '../../libs/zod'

export const StrategyStaticMarketchema: ZodSchema<IStrategy_StaticMarket_CreateInput> = z.object({
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
