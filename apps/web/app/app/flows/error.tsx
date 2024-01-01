'use client'

import { useEffect } from 'react';
import { ErrorInfo } from '../../../shared/components/ErrorInfo';
import { PageContainer } from '../components/PageContainer';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
	useEffect(() => {
		// Optionally log the error to an error reporting service
		console.error(error)
	}, [error])

	return (
		<PageContainer className="flex min-h-full flex-col items-center justify-center">
			<ErrorInfo errorObject={error}></ErrorInfo>
		</PageContainer>
	)
}
