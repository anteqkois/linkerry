import * as z from 'zod'

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3, { message: 'Password must contain at least 9 character(s)' }),
})
