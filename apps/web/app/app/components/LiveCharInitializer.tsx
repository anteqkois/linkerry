'use client'

import { HTMLAttributes, useEffect } from 'react'
import { useLiveChat } from '../../../libs/Tawk'
import { useUser } from '../../../modules/user/useUser'

export interface LiveCharInitializerProps extends HTMLAttributes<HTMLElement> {}

export const LiveCharInitializer = () => {
	const { user, liveChatHash } = useUser()
	const { liveChatRef } = useLiveChat()

	useEffect(() => {
		if (!liveChatHash || !user || !liveChatRef.current.setAttributes) return

		setTimeout(() => {
			// TODO fix missing tags in livechat
			liveChatRef.current.setAttributes(
				{
					// name: user.name,
					email: user.email,
					// id: user._id,
					// hash: liveChatHash,
				},
				function (error: any) {
					console.error(`Tawk error`, error)
				},
			)
		}, 1_000)
	}, [liveChatHash, liveChatRef])

	return <></>
}
