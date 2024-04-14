'use client'

import { HTMLAttributes, useEffect } from 'react'
import { EmailVerificationDialog } from '../../../../modules/user/components/EmailVerificationDialog'
import { useUser } from '../../../../modules/user/useUser'

export interface EmailVerificationProps extends HTMLAttributes<HTMLElement> {}

export const EmailVerification = ({}: EmailVerificationProps) => {
	const { emialVerificationDialog, setEmialVerificationDialog, user } = useUser()

	useEffect(() => {
		if (!user.emailVerifiedAtDate) setEmialVerificationDialog(true)
	}, [])

	return (
		<>
			<EmailVerificationDialog />
		</>
	)
}
