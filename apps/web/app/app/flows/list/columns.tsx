'use client'

import { ColumnDef } from '@tanstack/react-table'

import {
  Checkbox,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@market-connector/ui-components/client'
import { Button, Icons, TableCellContent } from '@market-connector/ui-components/server'
import Link from 'next/link'
import { dayjs } from '../../../../libs/dayjs'
import { TableColumnHeader } from '../../../../shared/components/Table/TableColumnHeader'

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: 'Strategy name',
  },
  {
    accessorKey: 'active',
    header: ({ column }) => <TableColumnHeader column={column} title="Active" sortable />,
    cell: ({ row }) => {
      return <TableCellContent variant={'boolean'}>{row.getValue('active')}</TableCellContent>
    },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => <TableColumnHeader column={column} title="State" sortable />,
    cell: ({ row }) => {
      return <TableCellContent position={'sortable'}>{row.getValue('state')}</TableCellContent>
    },
  },
  {
    accessorKey: 'testMode',
    header: ({ column }) => <TableColumnHeader column={column} title="Test" sortable />,
    cell: ({ row }) => {
      return <TableCellContent variant={'boolean'}>{row.getValue('testMode')}</TableCellContent>
    },
  },
  {
    accessorKey: 'triggeredTimes',
    header: ({ column }) => <TableColumnHeader column={column} title="Triggered" sortable />,
    cell: ({ row }) => {
      return <TableCellContent position={'centered'}>{row.getValue('triggeredTimes')}</TableCellContent>
    },
  },
  {
    accessorKey: 'createdAt',
    header: 'Created At',
    cell: ({ row }) => {
      const formated = dayjs(row.getValue('createdAt')).format('ll')
      return <div className="font-medium">{formated}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const strategy = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <Icons.more className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            {/* <DropdownMenuItem onClick={() => navigator.clipboard.writeText(exchange.exchangeCode)}>
              Copy exchange name
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <Link href={`/app/strategies/editor/${strategy._id}`} prefetch={false}>
              <DropdownMenuItem className="flex gap-1 justify-between items-center">
                <span>Edit</span>
                <Icons.edit />
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem>Run</DropdownMenuItem>
            <DropdownMenuItem>Move to Test Mode</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
