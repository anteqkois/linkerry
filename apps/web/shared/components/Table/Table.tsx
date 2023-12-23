'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { useEffect, useState } from 'react'
import { usePredefinedMediaQuery } from '../../hooks/usePredefinedMediaQuery'
import { DataTableToolbarProps, TableToolbar } from './Toolbar'

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<any, TValue>[]
  data: TData[]
  filterAccessor?: keyof TData
  chooseFilters?: DataTableToolbarProps<TData, TValue>['chooseFilters']
  className?: string
  mobileHiddenColumns?: (keyof TData | 'buttons')[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterAccessor,
  chooseFilters,
  className,
  mobileHiddenColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    logoUrl: false,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { isMobile } = usePredefinedMediaQuery()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      rowSelection,
      columnVisibility,
      columnFilters,
    },
    enableRowSelection: true,
    enableHiding: !!mobileHiddenColumns?.length,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    if (!mobileHiddenColumns?.length) return

    if (isMobile)
      table.setColumnVisibility(() => {
        return mobileHiddenColumns.reduce((prev, curr) => {
          prev[curr] = false
          return prev
        }, {} as any) as VisibilityState
      })
    else {
      table.resetColumnVisibility()
    }
  }, [isMobile])

  return (
    <div className={cn('space-y-4 w-full', className)}>
      {isMobile}
      {filterAccessor || chooseFilters ? <TableToolbar table={table} filterAccessor={filterAccessor} chooseFilters={chooseFilters} /> : null}
      <div className="rounded-md border w-full overflow-auto bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 pl-3 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
