import { Language } from '../models/language'

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

export interface JWTToken {
  sub: string
  name: string
}

export interface JWTUser {
  id: string
  name: string
}

export enum AuthStatus {
  LOADING = 'loading',
  AUTHENTICATED = 'authenticated',
  UNAUTHENTICATED = 'unauthenticated',
}
