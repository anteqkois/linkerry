'use client'

import { assertNotNullOrUndefined } from '@linkerry/shared'
import { Card, CardContent } from '@linkerry/ui-components/server'
import { CategoryScale, Chart as ChartJS, ChartOptions, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from 'chart.js'
import dayjs from 'dayjs'
import { HTMLAttributes, useMemo } from 'react'
import { Line } from 'react-chartjs-2'
import { useUsage } from '../../../../modules/billing/usage/useUsage'
import { ErrorInfo, Spinner } from '../../../../shared/components'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export const options: ChartOptions<'line'> = {
	responsive: true,
	plugins: {
		// legend: {
		// 	position: 'top' as const,
		// },
		title: {
			display: true,
			text: '7 days statistics',
			color: 'white',
		},
	},
	// radius: 10,
	interaction: {
		intersect: false,
	},
	elements: {
		line: {
			tension: 0.4,
		},
	},
	scales: {
		y: {
			axis: 'y',
			min: 0
			// ticks:{

			// }
			// offset: true,
		},
	},
	// scales: [
	// 	{
	// 		axis: 'y',
	// 		offset: true,
	// 	},
	// 	{
	// 		axis: 'x',
	// 		offset: true,
	// 	},
	// ],

	// scales: {
	// 	options: {
	// 		axis:'y'
	// 		ticks: {
	// 			minRotation: 40,
	// 			// suggestedMin: 50, // Adjust this value as needed
	// 		},
	// 		// yAxes: [
	// 		// 	{
	// 		// 		ticks: {
	// 		// 			// Add an offset to the minimum value of the y-axis scale
	// 		// 		},
	// 		// 	},
	// 		// ],
	// 	},
	// },
}

const currentDay = dayjs().format('dddd')
// Generate an array of the past 7 days
// const labels = Array.from({ length: 7 }, (_, i) => dayjs().subtract(i, 'day').format('dddd')).reverse()
const labels = [...Array.from({ length: 6 }, (_, i) => dayjs().subtract(i, 'day').format('dddd')).reverse(), 'Today']
const labelDays = [...Array.from({ length: 7 }, (_, i) => dayjs().subtract(i, 'day'))]

// export const data = {
// 	labels,
// 	datasets: [
// 		{
// 			fill: true,
// 			// label: 'Dataset 2',
// 			data: [34, 23, 62, 21, 43, 61, 34, 43, 14, 53, 15, 24, 23, 34, 42],
// 			// data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
// 			borderColor: 'hsl(262.1, 83.3%, 57.8%)',
// 			backgroundColor: 'hsla(262.1, 83.3%, 57.8%, 0.1)',
// 		},
// 	],
// }

export interface ChartStatisticProps extends HTMLAttributes<HTMLElement> {}

export const ChartStatistic = () => {
	const { usage, usageError, usageStatus } = useUsage()
	// const { currentPlanConfiguration, subscriptionsError, subscriptionsStatus } = useSubscriptions()

	const chartData = useMemo(() => {
		if (usageStatus !== 'success')
			return {
				labels,
				datasets: [
					{
						fill: true,
						// label: 'Dataset 2',
						data: [34, 23, 62, 21, 43, 61, 34, 43, 14, 53, 15, 24, 23, 34, 42],
						// data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
						borderColor: 'hsl(262.1, 83.3%, 57.8%)',
						backgroundColor: 'hsla(262.1, 83.3%, 57.8%, 0.1)',
					},
				],
			}

		assertNotNullOrUndefined(usage?.tasksPastSevenDays, 'usage.tasksPastSevenDays')

		const data = []
		for (const [index, dayUsage] of usage.tasksPastSevenDays.entries()) {
			const createdAtDate = dayjs(dayUsage.createdAt)

			/* If no usage in this day, add 0 to chart */
			if (createdAtDate.isSame(labelDays[index], 'day')) data.push(dayUsage.tasks)
			else data.push(0)
		}

		return {
			labels: labelDays.map((date) => date.format('dddd')).reverse(),
			datasets: [
				{
					fill: true,
					label: 'Tasks',
					data: data.reverse(),
					borderColor: 'hsl(262.1, 83.3%, 57.8%)',
					backgroundColor: 'hsla(262.1, 83.3%, 57.8%, 0.1)',
				},
			],
		}

		// if (!usage?.tasks || !currentPlanConfiguration?.tasks) return 0
		// const usagePercent = (usage.tasks * 100) / currentPlanConfiguration.tasks
		// return Math.round(usagePercent) === usagePercent ? usagePercent : usagePercent.toFixed(1)
	}, [usage, usageStatus])

	if (usageStatus === 'pending') return <Spinner />
	if (usageStatus === 'error') return <ErrorInfo errorObject={usageError} />

	return (
		<Card>
			{/* <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">From Monday</CardTitle>
					<Icons.Analytics className="h-4 w-4 text-muted-foreground" />
				</CardHeader> */}
			<CardContent>
				{/* <Line options={options} data={data} /> */}
				<Line options={options} data={chartData} />
			</CardContent>
		</Card>
	)
}
