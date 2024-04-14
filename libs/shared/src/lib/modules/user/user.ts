import { DatabaseTimestamp } from '../../common'
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
	_id: string
	name: string
	roles: UserRole[]
	phone?: string
	// telegramId?: string  // Move to external collection (notification-channels)
	// telegramBotConnected?: boolean
	email: string
	emailVerifiedAtDate?: Date
	trialExpiredAtDate?: Date
	trialStartedAtDate?: Date
	deletedAtDate?: Date
	cryptoWallet?: string
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
