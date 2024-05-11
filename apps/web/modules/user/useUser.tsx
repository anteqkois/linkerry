'use client'
import { AuthStatus, Cookies, IAuthLogoutResponse, LoginInput, SignUpInput, SignUpResponse, User } from '@linkerry/shared'
import { useRouter, useSearchParams } from 'next/navigation'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useCallback, useContext, useState } from 'react'
import { useCookie } from '../../shared/hooks/useCookie'
import { useLocalStorage } from '../../shared/hooks/useLocalStorage'
import { AuthApi } from './api'

type ReturnType = {
	authStatus: AuthStatus
	liveChatHash: string
	setAuthStatus: Dispatch<SetStateAction<AuthStatus>>
	user: User
	setUser: Dispatch<SetStateAction<User>>
	signUp: (data: SignUpInput) => Promise<SignUpResponse>
	login: (data: LoginInput) => Promise<void>
	logout: () => Promise<IAuthLogoutResponse>
	/* emial verification */
	emialVerificationDialog: boolean
	setEmailVerificationDialog: Dispatch<SetStateAction<boolean>>
}

const Context = createContext<ReturnType>({} as ReturnType)

export function UserProvider({ children }: PropsWithChildren) {
	const [authStatus, setAuthStatus] = useCookie<AuthStatus>(Cookies.AUTH_STATUS, AuthStatus.LOADING)
	const [user, setUser] = useLocalStorage('user-data', {} as User)
	const [liveChatHash, setLiveChatHash] = useState('')
	const [emialVerificationDialog, setEmailVerificationDialog] = useState<boolean>(false)
	const { push } = useRouter()
	const searchParams = useSearchParams()

	const signUp = useCallback(async (data: SignUpInput) => {
		const response = await AuthApi.signUp(data)

		setUser(response.data.user)
		setAuthStatus(AuthStatus.AUTHENTICATED)
		return response.data
	}, [])

	const login = useCallback(async (input: LoginInput) => {
		const { data } = await AuthApi.login({
			email: input.email,
			password: input.password,
		})

		setUser(data.user)
		setAuthStatus(AuthStatus.AUTHENTICATED)

		if (!data.user.emailVerifiedAtDate) {
			return push('/app/dashboard')
		}

		const from = searchParams.get('from')
		if (from) return push(from)

		return push('/app/dashboard')
	}, [])

	const logout = useCallback(async () => {
		const response = await AuthApi.logout()

		setUser({} as User)
		setAuthStatus(AuthStatus.UNAUTHENTICATED)
		// if(response.data.error) // TODO handle error
		push('/')

		return response.data
	}, [])

	// useEffect(() => {
	// 	if(!user) return
	// 	;(async () => {
	// 		const { data } = await UserApi.liveChatHash()
	// 		setLiveChatHash(data)
	// 	})()
	// }, [user])

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
				emialVerificationDialog,
				setEmailVerificationDialog,
				liveChatHash
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
