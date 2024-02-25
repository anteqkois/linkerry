import { Language } from '../modules/language'
import { Id } from './database'

export interface IAuthSignUpInput {
	email: string
	password: string
	name: string
	language: Language
	consents: Record<string, boolean>
}

export interface IAuthSignUpResponse {
	user: any
	error: string | undefined
}

export interface IAuthLoginInput {
	email: string
	password: string
}

export interface IAuthLoginResponse {
	user: any
	error: string | undefined
}

export interface IAuthLogoutResponse {
	error: string | undefined
}

export interface JwtCustomerTokenPayload {
	sub: string
	type: JWTPrincipalType.CUSTOMER
	projectId?: Id
	exp: number
	iss: 'linkerry'
}

export interface JwtWorkerTokenPayload {
	sub: string
	type: JWTPrincipalType.WORKER
	projectId: Id
	exp: number
	iss: 'linkerry'
}

export type JwtTokenPayload = JwtCustomerTokenPayload | JwtWorkerTokenPayload

export interface RequestUser extends Omit<JwtCustomerTokenPayload, 'sub' | 'iss'> {
	id: string
	name: string
	projectId: Id
}
export interface RequestWorker extends Omit<JwtWorkerTokenPayload, 'sub' | 'iss'> {}

export enum AuthStatus {
	LOADING = 'LOADING',
	AUTHENTICATED = 'AUTHENTICATED',
	UNAUTHENTICATED = 'UNAUTHENTICATED',
}

export enum JWTPrincipalType {
	CUSTOMER = 'CUSTOMER',
	WORKER = 'WORKER',
}
