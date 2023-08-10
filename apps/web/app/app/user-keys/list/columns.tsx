'use client'

// import dayjs from 'dayjs'
import { IUserKeys } from '@market-connector/types'
import { Column, ColumnDef } from '@tanstack/react-table'

import { Button, Icons } from '@market-connector/ui-components/server'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Checkbox,
} from '@market-connector/ui-components/client'
import { dayjs } from '../../../../libs/dayjs'

function TableColumnHeader<TColumn>({
  column,
  title,
  sortable = false,
}: {
  column: Column<TColumn>
  title: string
  sortable?: boolean
}) {
  return sortable ? (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <Icons.sort className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    <div className="text-right">{title}</div>
  )
}

export const columns: ColumnDef<IUserKeys>[] = [
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
    header: 'Keys name',
  },
  {
    accessorKey: 'exchangeCode',
    header: ({ column }) => <TableColumnHeader column={column} title="Exchange" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium pl-4">{row.getValue('exchangeCode')}</div>
    },
  },
  {
    accessorKey: 'aKeyInfo',
    header: () => <div className="text-right">Access Key</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('aKeyInfo')}...</div>
    },
  },
  {
    accessorKey: 'sKeyInfo',
    header: () => <div className="text-right">Secret Key</div>,
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('sKeyInfo')}...</div>
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
      const exchange = row.original

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
            <DropdownMenuItem>View exchange info</DropdownMenuItem>
            <DropdownMenuItem>Deleye keys</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
