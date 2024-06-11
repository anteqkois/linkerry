/* eslint-disable react-hooks/rules-of-hooks */
'use client'

import {
  FlowOperationType,
  FlowPopulated,
  FlowStatus,
  TriggerType,
  assertNotNullOrUndefined,
  buildImageUrlFromConnectorPacakgeName,
  flowHelper,
  isCustomHttpExceptionAxios,
  isStepBaseSettings,
  isTrigger,
} from '@linkerry/shared'
import {
  ButtonClient,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  MenubarShortcut,
  Switch,
  ToastAction,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  useToast,
} from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useState } from 'react'
import { getBrowserQueryCllient } from '../../../libs/react-query'
import { TableColumnHeader } from '../../../shared/components/Table/TableColumnHeader'
import { stopPropagation, withStopPropagation } from '../../../shared/utils'
import { FlowApi } from './api'

export const columns: ColumnDef<FlowPopulated>[] = [
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
      return <div className="font-medium ">{row.original.version.displayName}</div>
    },
  },
  {
    id: 'steps',
    accessorFn: (row) => row.version.stepsCount,
    header: ({ column }) => <TableColumnHeader column={column} title="Steps" sortable />,
    cell: ({ row }) => {
      const flowVersionChainMap = flowHelper.transformFlowVersionToChainMap(row.original.version)
      const isEmptyFlow = flowVersionChainMap[0][0].type === TriggerType.EMPTY

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="font-medium max-w-[150px] truncate" onClick={stopPropagation}>
                <span className="pl-1 max-w-[10px] overflow-hidden">
                  {isEmptyFlow ? (
                    'Empty Trigger'
                  ) : (
                    <>
                      {flowVersionChainMap[0].slice(0, 4).map((step, index) => {
                        if (!isStepBaseSettings(step.settings))
                          return (
                            <span
                              key={step.name}
                              className="h-[26px] w-[26px] inline-block bg-muted text-muted-foreground rounded-full text-center text-base border border-muted-foreground"
                              style={{ transform: `translate(-${index * 6}px, 0px)` }}
                            >
                              ?
                            </span>
                          )
                        return (
                          <Image
                            key={step.name}
                            width={26}
                            height={26}
                            className="inline-block bg-muted text-muted-foreground rounded-full"
                            style={{ transform: `translate(-${index * 6}px, 0px)` }}
                            src={buildImageUrlFromConnectorPacakgeName(step.settings.connectorName)}
                            alt={step.displayName}
                          />
                        )
                      })}
                      {flowVersionChainMap[0].length > 4 ? (
                        <span
                          className="h-7 w-7 inline-block bg-muted text-muted-foreground rounded-full text-center text-base border border-muted-foreground"
                          style={{ transform: `translate(-${24}px, 0px)` }}
                        >
                          +{flowVersionChainMap[0].length - 4}
                        </span>
                      ) : null}
                    </>
                  )}
                </span>
              </div>
            </TooltipTrigger>
            {isEmptyFlow ? null : (
              <TooltipContent onClick={stopPropagation}>
                {flowVersionChainMap[0].map((step) => (
                  <div key={step.name} className="flex flex-col ">
                    {!isTrigger(step) && <Icons.ArrowDown className="w-full" />}
                    <p>{`${isTrigger(step) ? 'Trigger' : 'Action'}: ${step.settings.connectorName} - ${step.displayName}`}</p>
                  </div>
                ))}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
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
      const { toast } = useToast()

      const hanleChangeStatus = async () => {
        if (!row.original.publishedVersionId)
          return toast({
            title: "Flow isn't published yet",
            description: 'Your flow required to be finidhed and published. Go to flow and edit their settings.',
            variant: 'destructive',
            action: (
              <ToastAction altText="Edit Flow">
                <Link href={`/app/flows/editor/${row.original._id}`}>Edit Flow</Link>
              </ToastAction>
            ),
          })

        await (table.options?.meta as any).onChangeFlowStatus(row.original)
      }

      return (
        <div className="font-medium" onClick={stopPropagation}>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Switch
                    id="flow-enabled"
                    checked={row.original.status === FlowStatus.ENABLED}
                    onCheckedChange={hanleChangeStatus}
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
      const [runingOperation, setRuningOperation] = useState(false)
      const [confirmDeleteInput, setConfirmDeleteInput] = useState('')
      const [confirmDialog, setConfirmDialog] = useState(false)
      const [showActions, setShowActions] = useState(false)
      const [renameInput, setRenameInput] = useState(row.original.version.displayName)
      const [renameDialog, setRenameDialog] = useState(false)

      const onClickRename = useCallback(async (newName: string) => {
        setRuningOperation(true)

        try {
          const { data } = await FlowApi.operation(row.original._id, {
            type: FlowOperationType.CHANGE_NAME,
            flowVersionId: row.original.version._id,
            request: {
              displayName: newName,
            },
          })

          toast({
            title: `Flow version name updated`,
            variant: 'success',
          })

          const queryClient = getBrowserQueryCllient()
          const cache = queryClient.getQueryData<FlowPopulated[]>(['flows'])
          queryClient.setQueryData(
            ['flows'],
            cache?.map((flow) => (flow._id === data._id ? data : flow)),
          )
          setRenameDialog(false)
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
            description: `The flow version name wasn't updated. Try again and when action still don't work, inform our Team`,
            variant: 'destructive',
          })
        } finally {
          setRuningOperation(false)
        }
      }, [])

      const onConfirmDelete = useCallback(async () => {
        if (confirmDeleteInput !== 'DELETE')
          return toast({
            title: `Invalid confirmation input value: "${confirmDeleteInput}"`,
            variant: 'destructive',
          })

        try {
          assertNotNullOrUndefined(row.original, 'flowToDelete')
          await FlowApi.delete(row.original._id)
          toast({
            title: `Flow deleted`,
            variant: 'success',
          })

          const queryClient = getBrowserQueryCllient()
          const data = queryClient.getQueryData<FlowPopulated[]>(['flows'])
          queryClient.setQueryData(
            ['flows'],
            data?.filter((flow) => flow._id !== row.original._id),
          )
          setConfirmDialog(false)
          setShowActions(false)
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
      }, [confirmDeleteInput])

      return (
        <>
          <DropdownMenu open={showActions} onOpenChange={setShowActions} modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0" onClick={withStopPropagation(() => setShowActions(true))}>
                <span className="sr-only">Open menu</span>
                <Icons.More className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={stopPropagation}>
              <Link href={`/app/flows/editor/${row.original._id}`}>
                <DropdownMenuItem disabled={runingOperation}>
                  Edit
                  <MenubarShortcut>
                    <Icons.Edit />
                  </MenubarShortcut>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem disabled={runingOperation} onClick={() => setRenameDialog(true)}>
                Rename
                <MenubarShortcut>
                  <Icons.Typing />
                </MenubarShortcut>
              </DropdownMenuItem>

              <DropdownMenuItem disabled={true}>Statistics</DropdownMenuItem>
              <DropdownMenuItem
                disabled={runingOperation}
                className="text-primary-foreground bg-negative/60 focus:bg-negative focus:text-negative-foreground group"
                onClick={(e) => {
                  setConfirmDialog(true)
                }}
              >
                Delete
                <MenubarShortcut>
                  <Icons.Delete className="text-primary-foreground group-hover:text-negative-foreground" />
                </MenubarShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={renameDialog} onOpenChange={setRenameDialog}>
            <DialogContent className="sm:max-w-[425px]" onClick={stopPropagation}>
              <DialogHeader>
                <DialogTitle>Rename Flow</DialogTitle>
              </DialogHeader>
              <div className="gap-4 py-4">
                <Input id="rename" value={renameInput} onChange={(e) => setRenameInput(e.target.value)} className="w-full" />
              </div>
              <DialogFooter>
                <ButtonClient onClick={() => onClickRename(renameInput)} loading={runingOperation}>
                  Confirm
                </ButtonClient>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
            <DialogContent className="sm:max-w-[425px]" onClick={stopPropagation}>
              <DialogHeader>
                <DialogTitle>Confirm deletion</DialogTitle>
                <DialogDescription>
                  <span>
                    Your data will be deleted from your main app views like this flow list. Data related to flow like flow runs, trigger events will
                    be pernament deleted. Flow strusture and flow versions will be archived.
                  </span>
                  <span className="mt-4">
                    Type <span className="font-bold">DELETE</span> and press Confirm to process delete action
                  </span>
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
              <DialogFooter>
                <Button variant={'destructive'} onClick={onConfirmDelete}>
                  Confirm
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )
    },
  },
]
