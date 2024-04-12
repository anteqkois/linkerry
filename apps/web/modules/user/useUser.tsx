'use client'
import {
	AuthStatus,
	Cookies,
	IAuthLoginInput,
	IAuthLoginResponse,
	IAuthLogoutResponse,
	IAuthSignUpInput,
	IAuthSignUpResponse,
	User,
} from '@linkerry/shared'
import { useRouter } from 'next/navigation'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useContext } from 'react'
import { useCookie } from '../../shared/hooks/useCookie'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { AuthApi } from './api'

type ReturnType = {
	authStatus: AuthStatus
	setAuthStatus: Dispatch<SetStateAction<AuthStatus>>
	user: User
	setUser: Dispatch<SetStateAction<User>>
	signUp: (data: IAuthSignUpInput) => Promise<IAuthSignUpResponse>
	login: (data: IAuthLoginInput) => Promise<IAuthLoginResponse>
	logout: () => Promise<IAuthLogoutResponse>
}

const Context = createContext<ReturnType>({} as ReturnType)

export function UserProvider({ children }: PropsWithChildren) {
	const [authStatus, setAuthStatus] = useCookie<AuthStatus>(Cookies.AUTH_STATUS, AuthStatus.LOADING)
	const [user, setUser] = useLocalStorage('user-data', {} as User)
	const { push } = useRouter()

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

	const logout = useCallback(async () => {
		const response = await AuthApi.logout()

		setUser({} as User)
		setAuthStatus(AuthStatus.UNAUTHENTICATED)
		// if(response.data.error) // TODO handle error
		push('/')

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
				logout,
			}}
		>
			{children}
		</Context.Provider>
	)
}

export function useUser() {
	const context = useContext(Context)
	if (!context) {
		throw new Error('useUser must be used within a UserProvider')
	}
	return context
}
