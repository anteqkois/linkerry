import { Language } from './language'

export enum UserRole {
  Customer = 'Customer',
  Admin = 'Admin',
  Tester = 'Tester',
}

// export enum UserRole {
//   CUSTOMER = 'customer',
//   ADMIN = 'admin',
//   TESTER = 'tester',
// }

export interface IUser {
  _id: string
  name: string
  roles: UserRole[]
  phone?: string
  // telegramId?: string  // Move to external collection (notification-channels)
  // telegramBotConnected?: boolean
  email: string
  emailVerifiedAtDate?: Date
  password: string
  trialExpiredAtDate?: Date
  trialStartedAtDate?: Date
  deletedAtDate?: Date
  cryptoWallet?: string
  language: Language
  affiliationPercent: number
  consents: Record<string, boolean>
  settings: any
  referrer?: string
  // referrer?: IUser;
  // remember_token
}

export interface IUserMetadata {
  earlyAdopter?: boolean
}
