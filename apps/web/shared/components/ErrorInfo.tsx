'use client'
import { isCustomError, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Small } from '@linkerry/ui-components/server'
import { HTMLAttributes, useEffect, useState } from 'react'

export interface ErrorInfoProps extends HTMLAttributes<HTMLElement> {
	message?: string
	/* It can be CustomError or Error from ReactQuery - retrived uisng isCustomHttpExceptionAxios*/
	errorObject?: unknown
}

export const ErrorInfo = ({ message, errorObject, children, className }: ErrorInfoProps) => {
	const [errorMessage, setErrorMessage] = useState('Something get wrong, try again later')

	// todo save all error events to db with customer id
	useEffect(() => {
		if (isCustomHttpExceptionAxios(errorObject)) setErrorMessage(errorObject.response.data.message)
		else if (isCustomError(errorObject) && errorObject.isOperational) setErrorMessage(errorObject.message)
		else if (message) setErrorMessage(message)
	}, [])

	return (
		<div className={className}>
			<Small className="text-negative flex-center">{errorMessage}</Small>
			<div>{children}</div>
		</div>
	)
}
