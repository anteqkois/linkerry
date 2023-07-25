'use client'
import {
  Cookies,
  AuthStatus,
  IAuthLoginInput,
  IAuthLoginResponse,
  IAuthSignUpInput,
  IAuthSignUpResponse,
  IUser,
} from '@market-connector/types'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useContext, useState } from 'react'
import { AuthApi } from '../api'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useCookie } from '../../hooks/useCookie'

type ReturnType = {
  authStatus: AuthStatus
  setAuthStatus: Dispatch<SetStateAction<AuthStatus>>
  user: IUser
  setUser: Dispatch<SetStateAction<IUser>>
  signUp: (data: IAuthSignUpInput) => Promise<IAuthSignUpResponse>
  login: (data: IAuthLoginInput) => Promise<IAuthLoginResponse>
}

const Context = createContext<ReturnType>({} as ReturnType)

export function UserProvider({ children }: PropsWithChildren) {
  const [authStatus, setAuthStatus] = useCookie<AuthStatus>(Cookies.AUTH_STATUS, AuthStatus.LOADING)
  const [user, setUser] = useLocalStorage('user-data', {} as IUser)

  const signUp = useCallback(async (data: IAuthSignUpInput) => {
    const response = await AuthApi.signUp(data)

    setUser(response.data.user)
    setAuthStatus(AuthStatus.AUTHENTICATED)
    return response.data
  }, [])

  const login = useCallback(async (data: IAuthLoginInput) => {
    const response = await AuthApi.login({
      email: data.email,
      password: data.password,
    })

    setUser(response.data.user)
    setAuthStatus(AuthStatus.AUTHENTICATED)
    return response.data
  }, [])

  return (
    <Context.Provider
      value={{
        authStatus,
        setAuthStatus,
        user,
        setUser,
        signUp,
        login,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useUser() {
  return useContext(Context)
}
