import { Language } from '../modules/language'

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
	name: string
	type: JWTPrincipalType.CUSTOMER
}

export interface JwtWorkerTokenPayload {
	sub: string
	type: JWTPrincipalType.WORKER
}

export type JwtTokenPayload = JwtCustomerTokenPayload | JwtWorkerTokenPayload

export interface RequestUser {
	id: string
	name: string
}

export enum AuthStatus {
	LOADING = 'LOADING',
	AUTHENTICATED = 'AUTHENTICATED',
	UNAUTHENTICATED = 'UNAUTHENTICATED',
}

export enum JWTPrincipalType {
	CUSTOMER = 'CUSTOMER',
	WORKER = 'WORKER',
}
