import * as z from 'zod';

// Helper function to check for common patterns (add more patterns as needed)
const commonPasswords = ['password', '123456', '12345678', 'qwerty', 'abc123', 'password1'];
const isCommonPassword = (password: string) => commonPasswords.includes(password);

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().
  min(8, { message: "Password must be at least 8 characters long." })
  .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter." })
  .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter." })
  // .regex(/[0-9]/, { message: "Password must contain at least one digit." })
  .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character: ! # $ % & ( ) * + , - . / : ; < = > ? @ [ ] ^ _ { | } ~" })
  .refine((password) => !isCommonPassword(password), { message: "Password is too common." })
})
