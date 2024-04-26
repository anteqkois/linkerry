import { tags } from 'typia'
import { DatabaseTimestamp, Id } from '../../common'
import { ShortStringType } from '../../common/type-validators'
import { Language } from '../language'

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

export interface User extends DatabaseTimestamp {
	_id: Id
	name: ShortStringType
	roles: UserRole[]
	phone?: ShortStringType
	// telegramId?: string  // Move to external collection (notification-channels)
	// telegramBotConnected?: boolean
	email: string & tags.Format<'email'>
	emailVerifiedAtDate?: Date
	trialExpiredAtDate?: Date
	trialStartedAtDate?: Date
	deletedAtDate?: Date
	cryptoWallet?: ShortStringType
	language: Language
	affiliationPercent: number
	consents: Record<string, boolean>
	settings: any
	referrer?: string
	// referrer?: User;
	// remember_token
}

export interface UserWithPassword extends User {
	password: string
}

export interface UserMetadata {
	earlyAdopter?: boolean
}
