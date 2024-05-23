'use client'

import { FlowRunStatus } from '@linkerry/shared'
import { Card, CardContent, CardHeader, CardTitle, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, useMemo } from 'react'
import { useDayjs } from '../../../../libs/dayjs'
import { useClientQuery } from '../../../../libs/react-query'
import { flowRunQueryConfig } from '../../../../modules/flows/flow-runs/query-config'
import { ErrorInfo, Spinner } from '../../../../shared/components'

export interface WeekFlowRunsInfoProps extends HTMLAttributes<HTMLElement> {}

export const WeekFlowRunsInfo = () => {
  const { weekStart } = useDayjs()
  const { data, status, error } = useClientQuery(flowRunQueryConfig.getMany({ fromDate: weekStart.toISOString() }))

  const flowRunsStatistic = useMemo(() => {
    if (status !== 'success')
      return {
        success: 0,
        error: 0,
      }

    const success = data.filter((flowRun) => flowRun.status === FlowRunStatus.SUCCEEDED)
    const error = data.filter(
      (flowRun) =>
        flowRun.status === FlowRunStatus.FAILED ||
        flowRun.status === FlowRunStatus.INTERNAL_ERROR ||
        flowRun.status === FlowRunStatus.QUOTA_EXCEEDED_TASKS ||
        flowRun.status === FlowRunStatus.TIMEOUT,
    )

    return {
      success: success.length,
      error: error.length,
    }
  }, [data, status])

  if (status === 'pending') return <Spinner />
  if (status === 'error') return <ErrorInfo errorObject={error} />

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">From Monday</CardTitle>
        <Icons.Analytics className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data.length} Flow Runs</div>
        <p className="text-xs text-muted-foreground">
          <span className="text-positive">{flowRunsStatistic.success} successfully</span>,{' '}
          <span className="text-negative">{flowRunsStatistic.error} failed</span>
        </p>
      </CardContent>
    </Card>
  )
}
