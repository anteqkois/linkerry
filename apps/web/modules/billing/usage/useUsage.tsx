'use client'

import { useClientQuery } from '../../../libs/react-query'
import { usageQueryConfig } from './query-configs'

export const useUsage = () => {
	const { data: usage, error: usageError, status: usageStatus } = useClientQuery(usageQueryConfig.getMany())

	return {
		usage,
		usageError,
		usageStatus,
	}
}
