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
  data?: TData[]
  filterAccessor?: keyof TData
  chooseFilters?: DataTableToolbarProps<TData, TValue>['chooseFilters']
  className?: string
  onlyColumns?: (keyof TData | 'buttons')[]
  mobileColumns?: (keyof TData | 'buttons')[]
  desktopColumns?: (keyof TData | 'buttons')[]
}

const getInitialCollumns = (onlyColumns: any[], allColumns: any[]): VisibilityState => {
  // when empty, show all colums
  if (!onlyColumns.length)
    return allColumns.reduce((prev, curr) => {
      prev[curr] = true
      return prev
    }, {} as any) as VisibilityState

  return allColumns.reduce((prev, curr) => {
    prev[curr] = onlyColumns.includes(curr)
    return prev
  }, {} as any) as VisibilityState
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterAccessor,
  chooseFilters,
  className,
  onlyColumns = [],
  desktopColumns,
  mobileColumns,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    getInitialCollumns(
      onlyColumns,
      columns.map((c) => c.id),
    ),
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const { isMobile } = usePredefinedMediaQuery()

  const table = useReactTable({
    data: data ?? [],
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
    // enableHiding: !!mobileColumns?.length || !!desktopColumns?.length,
    enableHiding: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  useEffect(() => {
    if (onlyColumns.length) return

    if (isMobile) {
      if (!mobileColumns?.length) {
        table.setColumnVisibility(() =>
          getInitialCollumns(
            onlyColumns,
            columns.map((c) => c.id),
          ),
        )
        return
      }

      table.setColumnVisibility((prev) => {
        return Object.keys(prev).reduce((prev, curr) => {
          prev[curr] = mobileColumns.includes(curr as any)
          return prev
        }, prev as any) as VisibilityState
      })
      return
    }

    if (!desktopColumns?.length) {
      table.setColumnVisibility(() =>
        getInitialCollumns(
          onlyColumns,
          columns.map((c) => c.id),
        ),
      )
      return
    }

    table.setColumnVisibility((prev) => {
      return Object.keys(prev).reduce((prev, curr) => {
        prev[curr] = desktopColumns.includes(curr as any)
        return prev
      }, prev as any) as VisibilityState
    })
  }, [isMobile])

  return (
    <div className={cn('space-y-4 w-full', className)}>
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
// 'use client'

// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFacetedRowModel,
//   getFacetedUniqueValues,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from '@tanstack/react-table'

// import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@market-connector/ui-components/server'
// import { cn } from '@market-connector/ui-components/utils'
// import { useEffect, useState } from 'react'
// import { usePredefinedMediaQuery } from '../../hooks/usePredefinedMediaQuery'
// import { DataTableToolbarProps, TableToolbar } from './Toolbar'

// export interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<any, TValue>[]
//   data?: TData[]
//   filterAccessor?: keyof TData
//   chooseFilters?: DataTableToolbarProps<TData, TValue>['chooseFilters']
//   className?: string
//   onlyColumns?: (keyof TData | 'buttons')[]
//   mobileColumns?: (keyof TData | 'buttons')[]
//   desktopColumns?: (keyof TData | 'buttons')[]
// }

// export function DataTable<TData, TValue>({
//   columns,
//   data,
//   filterAccessor,
//   chooseFilters,
//   className,
//   onlyColumns = [],
//   desktopColumns,
//   mobileColumns,
// }: DataTableProps<TData, TValue>) {
//   const [sorting, setSorting] = useState<SortingState>([])
//   const [rowSelection, setRowSelection] = useState({})
//   const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
//     {}
//     // onlyColumns?.reduce((prev, curr) => {
//     //   prev[curr] = true
//     //   return prev
//     // }, {} as any) as VisibilityState,
//   )
//   const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
//   const { isMobile } = usePredefinedMediaQuery()

//   const table = useReactTable({
//     data: data ?? [],
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     onSortingChange: setSorting,
//     getSortedRowModel: getSortedRowModel(),
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       rowSelection,
//       columnVisibility,
//       columnFilters,
//     },
//     enableRowSelection: true,
//     // enableHiding: !!mobileColumns?.length || !!desktopColumns?.length,
//     enableHiding: true,
//     onColumnFiltersChange: setColumnFilters,
//     onColumnVisibilityChange: setColumnVisibility,
//     getFilteredRowModel: getFilteredRowModel(),
//     getFacetedRowModel: getFacetedRowModel(),
//     getFacetedUniqueValues: getFacetedUniqueValues(),
//   })

//   useEffect(() => {
//     if (isMobile) {
//       console.log(
//         (mobileColumns || onlyColumns).reduce((prev, curr) => {
//           prev[curr] = true
//           return prev
//         }, {} as any) as VisibilityState,
//       )

//       table.setColumnVisibility(() => ({
//         logoUrl: true,
//         displayName: true,
//         tags: true,
//       }))
//       // table.setColumnVisibility(() => {
//       //   return (mobileColumns || onlyColumns).reduce((prev, curr) => {
//       //     prev[curr] = true
//       //     return prev
//       //   }, {} as any) as VisibilityState
//       // })
//     } else {
//       // console.log(
//       //   'DESKTOP 2',
//       //   (desktopColumns || onlyColumns).reduce((prev, curr) => {
//       //     prev[curr] = true
//       //     return prev
//       //   }, {} as any) as VisibilityState,
//       // )
//       // table.setColumnVisibility(() => {
//       //   return (desktopColumns || onlyColumns).reduce((prev, curr) => {
//       //     prev[curr] = true
//       //     return prev
//       //   }, {} as any) as VisibilityState
//       // })
//     }
//   }, [isMobile])

//   return (
//     <div className={cn('space-y-4 w-full', className)}>
//       {JSON.stringify(columnVisibility)}
//       {filterAccessor || chooseFilters ? <TableToolbar table={table} filterAccessor={filterAccessor} chooseFilters={chooseFilters} /> : null}
//       <div className="rounded-md border w-full overflow-auto bg-card">
//         <Table>
//           <TableHeader>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => {
//                   return (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
//                     </TableHead>
//                   )
//                 })}
//               </TableRow>
//             ))}
//           </TableHeader>
//           <TableBody>
//             {table.getRowModel().rows?.length ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={columns.length} className="h-24 text-center">
//                   No results.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </div>
//       <div className="flex items-center justify-end space-x-2 py-4">
//         <div className="flex-1 pl-3 text-sm text-muted-foreground">
//           {table.getFilteredSelectedRowModel().rows.length} of {table.getFilteredRowModel().rows.length} row(s) selected.
//         </div>
//         <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
//           Previous
//         </Button>
//         <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
//           Next
//         </Button>
//       </div>
//     </div>
//   )
// }
