'use client'

import { Card, CardContent, CardHeader, CardTitle, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { useUsage } from '../../../../modules/billing/usage/useUsage'
import { ErrorInfo, Spinner } from '../../../../shared/components'

export interface FlowsInfoProps extends HTMLAttributes<HTMLElement> {}

export const FlowsInfo = () => {
  const { usage, usageError, usageStatus } = useUsage()

  if (usageStatus === 'pending') return <Spinner />
  if (usageStatus === 'error') return <ErrorInfo errorObject={usageError} />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Flows</CardTitle>
        <Icons.Analytics className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{usage?.flows} Created</div>
        <p className="text-xs text-muted-foreground">{usage?.maximumActiveFlows} Active</p>
      </CardContent>
    </Card>
  )
}
