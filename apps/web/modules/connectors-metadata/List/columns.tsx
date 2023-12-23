'use client'

import { ConnectorMetadata } from '@market-connector/connectors-framework'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@market-connector/ui-components/client'
import { Badge, Button, Icons } from '@market-connector/ui-components/server'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { TableColumnHeader } from '../../../shared/components/Table/TableColumnHeader'

export const columns: ColumnDef<ConnectorMetadata>[] = [
  // todo add like/saved field
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
  {
    accessorKey: 'logoUrl',
    cell: ({ row }) => {
      return (
        <div className="font-medium pl-4">
          <Image width={26} height={26} src={row.getValue('logoUrl')} alt={row.getValue('displayName')} />
        </div>
      )
    },
  },
  {
    accessorKey: 'displayName',
    header: ({ column }) => <TableColumnHeader column={column} title="Name" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium pl-4">{row.getValue('displayName')}</div>
    },
  },
  {
    accessorKey: 'tags',
    filterFn: 'arrIncludesSome',
    header: ({ column }) => <TableColumnHeader column={column} title="Tags" />,
    cell: ({ row }) => {
      return (
        <div className="font-medium flex gap-1 flex-wrap max-w-md">
          {(row.getValue('tags') as string[]).map((tag) => (
            <Badge key={tag} variant={'outline'}>
              #{tag}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: 'description',
    cell: ({ row }) => {
      return <div className="font-medium">{row.getValue('description')}</div>
    },
  },
  {
    accessorKey: 'triggers',
    header: ({ column }) => <TableColumnHeader column={column} title="Triggers" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.getValue('triggers')}</div>
    },
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.getValue('actions')}</div>
    },
  },
  {
    accessorKey: 'version',
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.getValue('version')}</div>
    },
  },
  {
    id: 'buttons',
    cell: ({ row }) => {
      // const connector = row.original

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
            <DropdownMenuItem>Show details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
