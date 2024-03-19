'use client'

import { FlowRun } from '@linkerry/shared'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<FlowRun>[] = [
	// TODO add delete flow run ?
	// {
	//   id: 'select',
	//   header: ({ table }) => (
	//     <Checkbox
	//       checked={table.getIsAllPageRowsSelected()}
	//       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
	//       aria-label="Select all"
	//     />
	//   ),
	//   cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />,
	//   enableSorting: false,
	//   enableHiding: false,
	// },
	// TODO fix errors in console
	{
		id: 'status',
		accessorKey: 'status',
		header: ({ column }) => <TableColumnHeader column={column} title="" />,
		cell: ({ row }) => {
			const status = row.original.status
			if (status === FlowRunStatus.SUCCEEDED)
				return (
					<div className="font-medium flex-center">
						<Icons.Check className="text-positive" />
					</div>
				)
			else if (status === FlowRunStatus.INTERNAL_ERROR || status === FlowRunStatus.FAILED)
				return (
					<div className="font-medium flex-center">
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<Icons.False className="text-negative" />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start" asChild>
									<p>Status - {status}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)
			else if (status === FlowRunStatus.QUOTA_EXCEEDED)
				return (
					<div className="font-medium flex-center">
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<Icons.Warn className="text-negative" />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start" asChild>
									<p>You exceeded your plan. Update to higher or wait for next billing period - {status}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)
			else if (status === FlowRunStatus.PAUSED)
				return (
					<div className="font-medium flex-center">
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<Icons.Pause />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start" asChild>
									<p>Flow run is paused - {status}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)
			else if (status === FlowRunStatus.TIMEOUT)
				return (
					<div className="font-medium flex-center">
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<Icons.Timeout className="text-negative" />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start" asChild>
									<p>The Flow run took to long time - {status}</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				)
		},
	},
	{
		id: 'startTime',
		accessorKey: 'startTime',
		header: ({ column }) => <TableColumnHeader column={column} title="Date" />,
		cell: ({ row }) => {
			return <div className="font-medium">{dayjs(row.original.startTime).format('YYYY-MM-DD HH:mm:ss')}</div>
		},
	},
	{
		id: 'duration',
		accessorFn: (row) => dayjs(row.startTime).diff(row.finishTime),
		header: ({ column }) => <TableColumnHeader column={column} title="Duration" sortable />,
		cell: ({ row }) => {
			return <div className="font-medium pl-4">{dayjs(row.original.finishTime).diff(row.original.startTime, 'minutes', true).toFixed(2)} min.</div>
		},
	},
	{
		id: 'buttons',
		cell: ({ row, table }) => {
			return (
				// TODO fix metdata type
				<Button   variant="ghost" className="h-8 w-8 p-0" onClick={() => (table.options?.meta as any).onSelectFlowRun(row.original._id)}>
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger>
								<Icons.ZoomIn />
							</TooltipTrigger>
							<TooltipContent side="bottom" align="start" asChild>
								<p>Expand Flow run details</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Button>
			)
			// return (
			// 	<DropdownMenu>
			// 		<DropdownMenuTrigger asChild>
			// 			<Button variant="ghost" className="h-8 w-8 p-0">
			// 				<span className="sr-only">Open menu</span>
			// 				<Icons.More className="h-4 w-4" />
			// 			</Button>
			// 		</DropdownMenuTrigger>
			// 		<DropdownMenuContent align="end">
			// 			<DropdownMenuLabel>Actions</DropdownMenuLabel>
			// 			{/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(exchange.exchangeCode)}>
			//         Copy exchange name
			//       </DropdownMenuItem> */}
			// 			<DropdownMenuSeparator />
			// 			<DropdownMenuItem>Show details</DropdownMenuItem>
			// 		</DropdownMenuContent>
			// 	</DropdownMenu>
			// )
		},
	},
]
