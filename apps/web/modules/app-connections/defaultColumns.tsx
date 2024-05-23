/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import { AppConnectionStatus, AppConnectionWithoutSensitiveData, assertNotNullOrUndefined, isCustomHttpExceptionAxios } from '@linkerry/shared'
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
  MenubarShortcut,
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
import { getBrowserQueryCllient } from '../../libs/react-query'
import { TableColumnHeader } from '../../shared/components/Table/TableColumnHeader'
import { AppConnectionsApi } from './api'

export const columns: ColumnDef<AppConnectionWithoutSensitiveData>[] = [
  {
    id: 'id',
    accessorKey: 'id',
    header: ({ column }) => <TableColumnHeader column={column} title="No." className="ml-2" />,
    cell: ({ row }) => {
      return <div className="font-medium ml-2">{row.index + 1}</div>
    },
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }) => <TableColumnHeader column={column} title="Name" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium ">{row.original.name}</div>
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
      return <div className="font-medium">{dayjs(row.original.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</div>
    },
  },
  {
    id: 'status',
    accessorKey: 'status',
    header: ({ column }) => <TableColumnHeader column={column} title="Status" sortable />,
    cell: ({ row }) => {
      if (row.original.status === AppConnectionStatus.ACTIVE)
        return (
          <div className="font-medium flex flex-row gap-2 items-center">
            <Icons.Check className="text-positive" />
            {row.original.status}
          </div>
        )
      else if (row.original.status === AppConnectionStatus.ERROR)
        return (
          <div className="font-medium">
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="flex flex-row gap-2 items-center">
                  <Icons.False className="text-negative" />
                  {row.original.status}
                </TooltipTrigger>
                <TooltipContent side="bottom" align="start" asChild>
                  <p>There may have been a problem refreshing the connection. Please connect the app again.</p>
                </TooltipContent>
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
      const [runingOperation, setRuningOperation] = useState(false)
      const [confirmDeleteInput, setConfirmDeleteInput] = useState('')
      const [confirmDialog, setConfirmDialog] = useState(false)
      const [showActions, setShowActions] = useState(false)
      const [appConnectionToDelete, setAppConnectionToDelete] = useState<AppConnectionWithoutSensitiveData>()

      const onDeleteAppConnection = useCallback((appConnection: AppConnectionWithoutSensitiveData) => {
        setConfirmDialog(true)
        setAppConnectionToDelete(appConnection)
      }, [])

      const onConfirmDelete = useCallback(async () => {
        setRuningOperation(true)
        // if (confirmDeleteInput !== 'DELETE')
        // 	return toast({
        // 		title: `Invalid confirmation input value: "${confirmDeleteInput}"`,
        // 		variant: 'destructive',
        // 	})
        try {
          assertNotNullOrUndefined(appConnectionToDelete, 'appConnectionToDelete')
          await AppConnectionsApi.delete(appConnectionToDelete._id)
          toast({
            title: `App Connection deleted`,
            variant: 'success',
          })

          const queryClient = getBrowserQueryCllient()
          const data = queryClient.getQueryData<AppConnectionWithoutSensitiveData[]>(['app-connections'])
          queryClient.setQueryData(
            ['app-connections'],
            data?.filter((appConnection) => appConnection._id !== appConnectionToDelete._id),
          )
          setConfirmDialog(false)
          setShowActions(false)
          setAppConnectionToDelete(undefined)
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
            description: `The app connection wasn't deleted. Try again and when deletion action still don't work, inform our Team`,
            variant: 'destructive',
          })
        } finally {
          setRuningOperation(false)
        }
      }, [confirmDeleteInput, appConnectionToDelete])

      return (
        <DropdownMenu open={showActions} onOpenChange={setShowActions} modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0" onClick={() => setShowActions(true)}>
              <span className="sr-only">Open menu</span>
              <Icons.More className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger>
                  <DropdownMenuItem disabled={true}>Refresh connection</DropdownMenuItem>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Unsupported now</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
              <DialogTrigger asChild disabled={runingOperation}>
                <DropdownMenuItem
                  className="bg-negative/60 focus:bg-negative focus:text-negative-foreground"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDeleteAppConnection(row.original)
                  }}
                >
                  Delete
                  <MenubarShortcut>
                    <Icons.Delete />
                  </MenubarShortcut>
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Confirm deletion</DialogTitle>
                  <DialogDescription>
                    Make sure that no flows use this connection, especially no running flows. If you delete a connection used by an active flow, it
                    will no longer work properly.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant={'destructive'} onClick={onConfirmDelete}>
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
