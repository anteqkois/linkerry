/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { FlowPopulated, FlowStatus, assertNotNullOrUndefined, flowHelper, isCustomHttpExceptionAxios } from '@linkerry/shared'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
	Switch,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	useToast,
} from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { useCallback, useState } from 'react'
import { getBrowserQueryCllient } from '../../../libs/react-query'
import { TableColumnHeader } from '../../../shared/components/Table/TableColumnHeader'
import { FlowApi } from './api'

export const columns: ColumnDef<FlowPopulated>[] = [
	{
		id: 'name',
		accessorKey: 'name',
		header: ({ column }) => <TableColumnHeader column={column} title="Name" className="ml-2" sortable />,
		cell: ({ row }) => {
			return <div className="font-medium">{row.original.version.displayName}</div>
		},
	},
	{
		id: 'steps',
		accessorFn: (row) => row.version.stepsCount,
		header: ({ column }) => <TableColumnHeader column={column} title="Steps" sortable />,
		cell: ({ row }) => {
			// return <div className="font-medium pl-4">{row.original.version.stepsCount}</div>
			const schema = flowHelper.buildFlowVersionTriggersSchemaGraph(row.original.version)
			console.log('schema', schema)
			return (
				<div className="font-medium pl-4">
					<span>{row.original.version.stepsCount}</span>
					{/* <div>{row.original.version.actions.map(step => step.)}</div> */}
				</div>
			)
		},
	},
	{
		id: 'createdAt',
		accessorKey: 'createdAt',
		header: ({ column }) => <TableColumnHeader column={column} title="Created At" sortable />,
		cell: ({ row }) => {
			return <div className="font-medium">{dayjs(row.original.createdAt).format('YYYY-MM-DD HH:mm:ss')}</div>
		},
	},
	{
		id: 'updatedAt',
		accessorKey: 'updatedAt',
		header: ({ column }) => <TableColumnHeader column={column} title="Updated At" sortable />,
		cell: ({ row }) => {
			return <div className="font-medium">{dayjs(row.original.version.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>
		},
	},
	{
		id: 'status',
		accessorKey: 'status',
		header: ({ column }) => <TableColumnHeader column={column} title="Status" sortable />,
		cell: ({ row, table }) => {
			return (
				<div className="font-medium">
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex-center">
									<Switch
										id="flow-enabled"
										checked={row.original.status === FlowStatus.ENABLED}
										onCheckedChange={() => (table.options?.meta as any).onChangeFlowStatus(row.original)}
										disabled={(table.options?.meta as any).runningOperation}
									/>
								</div>
							</TooltipTrigger>
							{row.original.status === FlowStatus.ENABLED && (
								<TooltipContent>
									<p>Published Version is run</p>
								</TooltipContent>
							)}
						</Tooltip>
					</TooltipProvider>
				</div>
			)
		},
	},
	{
		id: 'buttons',
		cell: ({ row }) => {
			const { toast } = useToast()
			const [confirmDeleteInput, setConfirmDeleteInput] = useState('')
			const [confirmDialog, setConfirmDialog] = useState(false)
			const [flowToDelete, setFlowToDelete] = useState<FlowPopulated>()

			const onDeleteFlow = useCallback(async (flow: FlowPopulated) => {
				setConfirmDialog(true)
				setFlowToDelete(flow)
			}, [])

			const onConfirmDelete = useCallback(async () => {
				console.log(confirmDeleteInput)
				if (confirmDeleteInput !== 'DELETE')
					return toast({
						title: `Invalid confirmation input value: "${confirmDeleteInput}"`,
						variant: 'destructive',
					})

				try {
					assertNotNullOrUndefined(flowToDelete, 'flowToDelete')
					await FlowApi.delete(flowToDelete._id)
					toast({
						title: `Flow deleted`,
						variant: 'success',
					})

					const queryClient = getBrowserQueryCllient()
					const data = queryClient.getQueryData<FlowPopulated[]>(['flows'])
					queryClient.setQueryData(
						['flows'],
						data?.filter((flow) => flow._id !== flowToDelete._id),
					)
				} catch (error) {
					if (isCustomHttpExceptionAxios(error))
						return toast({
							title: `Something went wrong`,
							description: error.response.data.message,
							variant: 'destructive',
						})

					console.error(error)
					toast({
						title: `Something went wrong`,
						description: `The flow wasn't deleted. Try again and when deletion action still don't work, inform our Team`,
						variant: 'destructive',
					})
				}
			}, [confirmDeleteInput, flowToDelete])

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<Icons.More className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem disabled={true}>Statistics</DropdownMenuItem>
						<Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
							<DialogTrigger asChild>
								<DropdownMenuItem
									className="flex select-none items-center cursor-pointer bg-negative/60 hover:bg-negative focus:bg-negative focus:text-negative-foreground"
									onClick={(e) => {
										e.preventDefault()
										// e.stopPropagation()
										onDeleteFlow(row.original)
									}}
								>
									Delete
									<Icons.Delete className="ml-auto" />
								</DropdownMenuItem>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Confirm deletion</DialogTitle>
									<DialogDescription>
										Your data will be deleted from your main app views like this flow list. Data related to flow like flow runs, trigger events will
										be pernament deleted. Flow strusture and flow versions will be archived.
									</DialogDescription>
									<DialogDescription>
										Type <span className="font-bold">DELETE</span> and press Confirm to process delete action
									</DialogDescription>
								</DialogHeader>
								<div className="gap-4 py-4">
									<Input
										id="delete"
										value={confirmDeleteInput}
										onChange={(e) => setConfirmDeleteInput(e.target.value)}
										className="w-full"
										placeholder="DELETE"
									/>
								</div>
								<Button type="submit" variant={'destructive'} onClick={onConfirmDelete}>
									Confirm 2
								</Button>
								<DialogFooter>
									<Button type="submit" variant={'destructive'} onClick={onConfirmDelete}>
										Confirm
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</DropdownMenuContent>
				</DropdownMenu>
			)
		},
	},
]
