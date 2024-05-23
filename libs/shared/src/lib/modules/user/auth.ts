import { z } from 'zod'
import { idSchema, stringShortSchema } from '../../common/zod'
import { Language } from '../language'
import { User } from './user'

export const signUpInputSchema = z.object({
  email: z.string().email().min(3).max(50),
  password: z.string().min(6).max(60), // TODO improve validation, requirements
  name: z.string().min(3).max(60),
  language: z.nativeEnum(Language),
  consents: z.record(z.boolean()),
  referrerId: idSchema.optional(), // TODO add mapping collection to have ability to get ref like https://linkerry.com/signup?ref=anteqkois
})
export interface SignUpInput extends z.infer<typeof signUpInputSchema> {}

// TODO refactor this to not use error field, insted server should throw error
export interface SignUpResponse {
  user: any
  error: string | undefined
}

export const loginInputSchema = signUpInputSchema.pick({
  email: true,
  password: true,
})
export interface LoginInput extends z.infer<typeof loginInputSchema> {}

export interface IAuthLoginResponse {
  user: User
}

export interface IAuthLogoutResponse {
  error: string | undefined
}

export const verifyEmailInputSchema = z.object({
  code: stringShortSchema,
})
export interface VerifyEmailInput extends z.infer<typeof verifyEmailInputSchema> {}
