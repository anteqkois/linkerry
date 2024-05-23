'use client'

import { FlowRunStatus, deepMerge, isNil } from '@linkerry/shared'
import { Card, CardContent } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import {
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  Point,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import dayjs from 'dayjs'
import { HTMLAttributes, useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import { useDayjs } from '../../../../libs/dayjs'
import { useClientQuery } from '../../../../libs/react-query'
import { useUsage } from '../../../../modules/billing/usage/useUsage'
import { flowRunQueryConfig } from '../../../../modules/flows/flow-runs/query-config'
import { ErrorInfo, Spinner } from '../../../../shared/components'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

// Generate an array of the past 7 days
// const labels = Array.from({ length: 7 }, (_, i) => dayjs().subtract(i, 'day').format('dddd')).reverse()
// const labels = [...Array.from({ length: 6 }, (_, i) => dayjs().subtract(i, 'day').format('dddd')).reverse(), 'Today']
const labelDays = [...Array.from({ length: 7 }, (_, i) => dayjs().subtract(i, 'day'))]

export type ChartStatisticProps = HTMLAttributes<HTMLElement>

export const ChartStatistic = ({ ...props }: ChartStatisticProps) => {
  const { weekStart } = useDayjs()
  const { usage, usageError, usageStatus } = useUsage()
  const {
    data: flowRuns,
    status: flowRunsStatus,
    error: flowRunsError,
  } = useClientQuery(flowRunQueryConfig.getMany({ fromDate: weekStart.toISOString() }))
  const [options, setOptions] = useState<ChartOptions<'line'>>({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '7 days statistics',
        color: 'white',
      },
      tooltip: {
        usePointStyle: true,
        // displayColors: false
        // position: 'nearest',
      },
    },
    // radius: 10,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
    scales: {
      y: {
        type: 'linear',
        axis: 'y',
        min: 0,
        grid: {
          lineWidth: 1,
          color: 'hsla(220, 14.3%, 95.9%, 0.1)',
        },
        // grid: {
        // 	drawOnChartArea: false, // only want the grid lines for one axis to show up
        // },
      },
      y1: {
        position: 'right',
      },
    },
  })
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    datasets: [
      {
        fill: true,
        data: [],
        borderColor: 'hsl(262.1, 83.3%, 57.8%)',
        backgroundColor: 'hsla(262.1, 83.3%, 57.8%, 0.1)',
      },
    ],
  })

  useEffect(() => {
    if (usageStatus !== 'success' && flowRunsStatus !== 'success') return
    if (isNil(usage?.tasksPastSevenDays) || isNil(flowRuns)) return

    const tasksData: ChartDataEntry[] = []
    const flowRunsAll: ChartDataEntry[] = []
    const flowRunsSuccess: ChartDataEntry[] = []
    const flowRunsFailed: ChartDataEntry[] = []
    for (const [index, day] of labelDays.entries()) {
      const label = index === 0 ? 'Today' : day.format('dddd')
      const dayUsage = usage.tasksPastSevenDays.find((dayUsage) => dayjs(dayUsage.createdAt).isSame(day, 'day'))
      /* If no usage in this day, add 0 to chart */
      if (!dayUsage) tasksData.push({ x: label, y: 0 })
      else tasksData.push({ x: label, y: dayUsage.tasks })

      const dayFlowRuns = flowRuns.filter((flowRun) => dayjs(flowRun.createdAt).isSame(day, 'day'))
      flowRunsAll.push({ x: label, y: dayFlowRuns.length })
      flowRunsFailed.push({
        x: label,
        y: dayFlowRuns.filter(
          (flowRun) =>
            flowRun.status === FlowRunStatus.FAILED ||
            flowRun.status === FlowRunStatus.INTERNAL_ERROR ||
            flowRun.status === FlowRunStatus.QUOTA_EXCEEDED_TASKS ||
            flowRun.status === FlowRunStatus.TIMEOUT,
        ).length,
      })
      flowRunsSuccess.push({ x: label, y: dayFlowRuns.filter((flowRun) => flowRun.status === FlowRunStatus.SUCCEEDED).length })
    }

    const minTasksUsage = Math.min(...tasksData.map((e) => e.y))
    const maxTaskUsage = Math.max(...tasksData.map((e) => e.y))

    const allGroupedFlowRuns = flowRunsAll.concat(flowRunsSuccess).concat(flowRunsFailed)
    const minFlowRuns = Math.min(...allGroupedFlowRuns.map((e) => e.y))
    const maxFlowRuns = Math.max(...allGroupedFlowRuns.map((e) => e.y))

    setOptions((options) => {
      const newOptions = deepMerge(options, {
        scales: {
          y: {
            min: Math.round(minTasksUsage * 0.8),
            max: Math.round(maxTaskUsage * 1.1),
          },
          y1: {
            min: Math.round(minFlowRuns * 0.8),
            max: Math.round(maxFlowRuns * 1.1),
          },
        },
      })

      return newOptions
    })

    setChartData({
      datasets: [
        {
          fill: true,
          label: 'Tasks',
          data: tasksData.reverse() as unknown as Point[],
          borderColor: 'hsl(262.1, 83.3%, 57.8%)',
          backgroundColor: 'hsla(262.1, 83.3%, 57.8%, 0.1)',
          yAxisID: 'y',
        },
        {
          fill: true,
          label: 'Successfully Flow Runs',
          data: flowRunsSuccess.reverse() as unknown as Point[],
          borderColor: 'hsl(142.1, 70.6%, 45.3%)',
          backgroundColor: 'hsla(142.1, 70.6%, 45.3%, 0.1)',
          yAxisID: 'y1',
        },
        {
          fill: true,
          label: 'Failed Flow Runs',
          data: flowRunsFailed.reverse() as unknown as Point[],
          borderColor: 'hsl(0, 72.2%, 50.6%)',
          backgroundColor: 'hsla(0, 72.2%, 50.6%, 0.1)',
          yAxisID: 'y1',
        },
        {
          fill: true,
          label: 'Flow Runs',
          data: flowRunsAll.reverse() as unknown as Point[],
          borderColor: 'hsl(220, 14.3%, 95.9%)',
          backgroundColor: 'hsla(220, 14.3%, 95.9%, 0.1)',
          yAxisID: 'y1',
        },
      ],
    })
  }, [usageStatus, flowRunsStatus])

  if (usageStatus === 'pending' || flowRunsStatus === 'pending') return <Spinner {...props} />
  if (usageStatus === 'error' || flowRunsStatus === 'error') return <ErrorInfo {...props} errorObject={usageError || flowRunsError} />

  return (
    <Card className={cn('', props.className)} {...props}>
      <CardContent className="h-full p-0 md:p-6 md:pt-0">
        <Line options={options} data={chartData} />
      </CardContent>
    </Card>
  )
}

export interface ChartDataEntry {
  x: string
  y: number
}
