'use client'

import { HTMLAttributes, useEffect } from 'react'
import { EmailVerificationDialog } from '../../../../modules/user/components/EmailVerificationDialog'
import { useUser } from '../../../../modules/user/useUser'

export interface EmailVerificationProps extends HTMLAttributes<HTMLElement> {}

// eslint-disable-next-line no-empty-pattern
export const EmailVerification = ({}: EmailVerificationProps) => {
	const { emialVerificationDialog, setEmialVerificationDialog, user } = useUser()

	useEffect(() => {
		if (!user.emailVerifiedAtDate) setEmialVerificationDialog(true)
	}, [])

	return <EmailVerificationDialog />
}
