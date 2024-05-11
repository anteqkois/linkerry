'use client'

import { HTMLAttributes, useEffect } from 'react'
import { EmailVerificationDialog } from '../../../../modules/user/components/EmailVerificationDialog'
import { useUser } from '../../../../modules/user/useUser'

export type EmailVerificationProps = HTMLAttributes<HTMLElement>

// eslint-disable-next-line no-empty-pattern
export const EmailVerification = ({}: EmailVerificationProps) => {
	const { emialVerificationDialog, setEmailVerificationDialog, user } = useUser()

	useEffect(() => {
		if (!user.emailVerifiedAtDate) setEmailVerificationDialog(true)
	}, [])

	return <EmailVerificationDialog />
}
