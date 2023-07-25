export interface IAuthSignUpInput {
  email: string
  password: string
  name: string
}

export interface IAuthSignUpResponse {
  user: any
  status: string
}

export interface JWTToken {
  sub: string,
  name: string
}

export interface JWTUser {
  id: string,
  name: string
}
