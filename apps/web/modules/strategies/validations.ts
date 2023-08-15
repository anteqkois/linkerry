import {
  IStrategyBuy_CreateInput,
  IStrategyBuy_PatchInput,
  IStrategyBuy_UpdateInput,
  IStrategy_PatchInput,
  IStrategy_StaticMarket_CreateInput,
  IStrategy_StaticMarket_UpdateInput,
  IStrategy_StrategyBuyPatchInput,
  StrategyBuyType,
  StrategyState,
  StrategyType,
} from '@market-connector/types'
import { z } from 'zod'
import { mongoIdSchema } from '../../libs/zod'

// Strategy Buy
export const StrategyBuy_CreateSchema = z.object({
  type: z.nativeEnum(StrategyBuyType, { invalid_type_error: 'Invalid strategy buy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  conditions: z.array(z.object({ id: mongoIdSchema, active: z.boolean(), condition: mongoIdSchema })),
}) satisfies z.ZodType<IStrategyBuy_CreateInput>
export interface IStrategyBuy_CreateSchema extends z.infer<typeof StrategyBuy_CreateSchema>{}

export const StrategyBuy_UpdateSchema = z.object({
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
}) satisfies z.ZodType<IStrategyBuy_UpdateInput>

export const StrategyBuy_PatchSchema = StrategyBuy_UpdateSchema.partial() satisfies z.ZodType<IStrategyBuy_PatchInput>
export interface IStrategyBuy_PatchSchema extends z.infer<typeof StrategyBuy_PatchSchema>{}


// Strategy
export const Strategy_StaticMarketCreateSchema = z.object({
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
}) satisfies z.ZodType<IStrategy_StaticMarket_CreateInput>
export interface IStrategy_StaticMarketCreateSchema extends z.infer<typeof Strategy_StaticMarketCreateSchema>{}

export const Strategy_StaticMarketUpdateSchema = z.object({
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
}) satisfies z.ZodType<IStrategy_StaticMarket_UpdateInput>
export interface IStrategy_StaticMarketUpdateSchema extends z.infer<typeof Strategy_StaticMarketUpdateSchema>{}

export const Strategy_PatchSchema = Strategy_StaticMarketUpdateSchema.partial() satisfies z.ZodType<IStrategy_PatchInput>
export interface IStrategy_PatchSchema extends z.infer<typeof Strategy_PatchSchema>{}

export const Strategy_StrategyBuyPatchSchema = StrategyBuy_PatchSchema.extend({
  active: z.boolean()
}) satisfies z.ZodType<IStrategy_StrategyBuyPatchInput>
export interface IStrategy_StrategyBuyPatchSchema extends z.infer<typeof Strategy_StrategyBuyPatchSchema>{}

export const Strategy_StrategyBuyCreateSchema = StrategyBuy_CreateSchema.extend({
  active: z.boolean()
}) satisfies z.ZodType<IStrategy_StrategyBuyPatchInput>
export interface IStrategy_StrategyBuyCreateSchema extends z.infer<typeof Strategy_StrategyBuyCreateSchema>{}
