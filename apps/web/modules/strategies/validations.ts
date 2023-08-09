import { IStrategyBuy_StaticMarket_CreateInput, StrategyBuyType } from "@market-connector/types";
import { ZodSchema, z } from "zod";

export const strategyBuySchema: ZodSchema<IStrategyBuy_StaticMarket_CreateInput> = z.object({
  type: z.nativeEnum(StrategyBuyType, { invalid_type_error: 'Invalid strategy buy type' }),
  name: z
    .string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  conditions: z.array(z.object({ id: z.string() })),
  // conditions: IStrategyBuy_Condition[]
})
