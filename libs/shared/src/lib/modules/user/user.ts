import { z } from 'zod';
import { BaseDatabaseFields } from '../../common';
import {
  idSchema,
  stringDateSchema,
  stringShortSchema,
} from '../../common/zod';
import { Language } from '../language';

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  TESTER = 'TESTER',
}

export const userSchema = z.object({
  name: stringShortSchema,
  roles: z.array(z.nativeEnum(UserRole)),
  phone: z.string().max(20).optional(),
  // telegramId?: string  // Move to external collection (notification-channels)
  // telegramBotConnected?: boolean
  email: z.string().email(),
  emailVerifiedAtDate: stringDateSchema.optional(),
  trialExpiredAtDate: stringDateSchema.optional(),
  trialStartedAtDate: stringDateSchema.optional(),
  deletedAtDate: stringDateSchema.optional(),
  // cryptoWallet?: string
  language: z.nativeEnum(Language),
  affiliationPercent: z.number(),
  consents: z.record(z.boolean()),
  settings: z.any(),
  referrerId: idSchema.optional(),
  // referrer?: User;
  // remember_token
});

export interface User extends BaseDatabaseFields, z.infer<typeof userSchema> {}

export interface UserWithPassword extends User {
  password: string;
}

export interface UserMetadata {
  earlyAdopter?: boolean;
}
