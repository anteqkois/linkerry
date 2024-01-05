import { isCustomError, isCustomHttpExceptionAxios } from '@market-connector/shared'
import { P } from '@market-connector/ui-components/server'
import { HTMLAttributes, useEffect, useState } from 'react'

export interface ErrorInfoProps extends HTMLAttributes<HTMLElement> {
	message?: string
	errorObject?: unknown
}

export const ErrorInfo = ({ message, errorObject, children }: ErrorInfoProps) => {
	const [errorMessage, setErrorMessage] = useState('Something get wrong, try again later')

	// todo save all error events to db with customer id
	useEffect(() => {
		if (isCustomHttpExceptionAxios(errorObject)) setErrorMessage(errorObject.response.data.message)
		else if (isCustomError(errorObject) && errorObject.isOperational) setErrorMessage(errorObject.message)
		else if (message) setErrorMessage(message)
	}, [])

	return (
		<div>
			<P className="text-negative center">{errorMessage}</P>
			<div>{children}</div>
		</div>
	)
}