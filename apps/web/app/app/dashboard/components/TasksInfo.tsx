'use client'

import { Card, CardContent, CardHeader, CardTitle, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, useMemo } from 'react'
import { useSubscriptions } from '../../../../modules/billing/subscriptions/useSubscriptions'
import { useUsage } from '../../../../modules/billing/usage/useUsage'
import { ErrorInfo, Spinner } from '../../../../shared/components'

export interface TasksInfoProps extends HTMLAttributes<HTMLElement> {}

export const TasksInfo = () => {
	const { usage, usageError, usageStatus } = useUsage()
	const { currentPlanConfiguration, subscriptionsError, subscriptionsStatus } = useSubscriptions()

	const tasksPercentUsage = useMemo(() => {
		if (!usage?.tasks || !currentPlanConfiguration?.tasks) return 0
		const usagePercent = (usage.tasks * 100) / currentPlanConfiguration.tasks
		return Math.round(usagePercent) === usagePercent ? usagePercent : usagePercent.toFixed(1)
	}, [subscriptionsStatus, usageStatus])

	if (usageStatus === 'pending' || subscriptionsStatus === 'pending') return <Spinner />
	if (usageStatus === 'error' || subscriptionsStatus === 'error') return <ErrorInfo errorObject={usageError ?? subscriptionsError} />

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">Tasks</CardTitle>
				<Icons.Analytics className="h-4 w-4 text-muted-foreground" />
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-bold">{`${usage?.tasks} / ${currentPlanConfiguration?.tasks} `}</div>
				<p className="text-xs text-muted-foreground">{tasksPercentUsage}%</p>
			</CardContent>
		</Card>
	)
}
