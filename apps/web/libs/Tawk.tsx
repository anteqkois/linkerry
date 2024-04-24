'use client'

import TawkMessengerReact from '@tawk.to/tawk-messenger-react'
import { MutableRefObject, PropsWithChildren, createContext, useCallback, useContext, useEffect, useRef } from 'react'
import { useLocalStorage } from '../shared/hooks/useLocalStorage'

type ReturnType = {
	liveChatRef: MutableRefObject<any>
	hidden: boolean
	open: () => void
	close: () => void
	toggleVisibility: () => void
}

const Context = createContext<ReturnType>({} as ReturnType)

export function LiveChatProvider({ children }: PropsWithChildren) {
	const [hidden, setHidden] = useLocalStorage('live-chat', false)
	const liveChatRef = useRef<any>()

	useEffect(() => {
		if (!liveChatRef.current) return
		setTimeout(() => {
			if (hidden) liveChatRef.current.hideWidget()
			else liveChatRef.current.showWidget()
		}, 300)
	}, [liveChatRef.current])

	const toggleVisibility = useCallback(() => {
		if (liveChatRef.current.isChatHidden()) {
			setHidden(false)
			liveChatRef.current.showWidget()
		} else {
			setHidden(true)
			liveChatRef.current.hideWidget()
		}
	}, [])

	const open = useCallback(() => {
		liveChatRef.current.maximize()
	}, [])

	const close = useCallback(() => {
		liveChatRef.current.minimize()
	}, [])

	return (
		<Context.Provider value={{ liveChatRef, open, close, toggleVisibility, hidden }}>
			<TawkMessengerReact ref={liveChatRef} propertyId="6628118b1ec1082f04e6041d" widgetId="1hs68926p" />
			{children}
		</Context.Provider>
	)
}

export function useLiveChat() {
	const context = useContext(Context)
	if (!context) {
		throw new Error('useLiveChat must be used within a UserProvider')
	}
	return context
}
