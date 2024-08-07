'use client'

import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@linkerry/ui-components/client'
import { Badge, Button, Icons } from '@linkerry/ui-components/server'
import { ColumnDef } from '@tanstack/react-table'
import Image from 'next/image'
import { TableColumnHeader } from '../../../../shared/components/Table/TableColumnHeader'

export const columns: ColumnDef<ConnectorMetadataSummary>[] = [
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
    id: 'logoUrl',
    accessorKey: 'logoUrl',
    header: 'Logo',
    cell: ({ row }) => {
      return (
        <div className="font-medium pl-4">
          <Image width={26} height={26} src={row.original.logoUrl} alt={row.original.displayName} />
          {/* <Image
            width={26}
            height={26}
            src={`/images/connectors/${getConnectorAppNameFromConnectorPacakgeName(row.original.name)}.png`}
            alt={row.original.displayName}
          /> */}
        </div>
      )
    },
  },
  {
    id: 'displayName',
    accessorKey: 'displayName',
    header: ({ column }) => <TableColumnHeader column={column} title="Name" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium pl-4">{row.original.displayName}</div>
    },
  },
  {
    id: 'tags',
    accessorKey: 'tags',
    filterFn: 'arrIncludesSome',
    cell: ({ row }) => {
      return (
        <div className="font-medium flex gap-1 flex-wrap max-w-md">
          {(row.original.tags as string[]).map((tag) => (
            <Badge key={tag} variant={'outline'}>
              #{tag}
            </Badge>
          ))}
        </div>
      )
    },
  },
  {
    id: 'description',
    accessorKey: 'description',
    cell: ({ row }) => {
      return <div className="font-medium">{row.original.description}</div>
    },
  },
  {
    id: 'triggers',
    accessorKey: 'triggers',
    header: ({ column }) => <TableColumnHeader column={column} title="Triggers" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.original.triggers}</div>
    },
  },
  {
    id: 'actions',
    accessorKey: 'actions',
    header: ({ column }) => <TableColumnHeader column={column} title="Actions" sortable />,
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.original.actions}</div>
    },
  },
  {
    id: 'version',
    accessorKey: 'version',
    cell: ({ row }) => {
      return <div className="font-medium text-center">{row.original.version}</div>
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
              <Icons.More className="h-4 w-4" />
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
