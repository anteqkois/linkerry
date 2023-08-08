import { ExchangeCode, IUserKeysCreateInput } from '@market-connector/types'
import { ZodSchema, nativeEnum, object, string } from 'zod'
import { mongoIdSchema } from '../../../libs/zod'

export const userKeysSchema: ZodSchema<IUserKeysCreateInput> = object({
  aKey: string()
    .min(10, {
      message: 'Too short key.',
    })
    .max(100, { message: 'Too long key' }),
  sKey: string()
    .min(10, {
      message: 'Too short key.',
    })
    .max(100, { message: 'Too long key' }),
  exchange: mongoIdSchema,
  exchangeCode: nativeEnum(ExchangeCode, {
    invalid_type_error: "Invalid exchange (check if Exchange are still suported at 'Supported Exchanges' list)",
  }),
  name: string()
    .min(2, {
      message: 'Too short name.',
    })
    .max(100, { message: 'Too long name' }),
  user: mongoIdSchema,
})