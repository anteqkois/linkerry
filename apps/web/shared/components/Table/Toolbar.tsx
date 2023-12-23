'use client'

import { Input } from '@market-connector/ui-components/client'
import { Button, Icons } from '@market-connector/ui-components/server'
import { Table } from '@tanstack/react-table'
import { DataTableFacetedFilterProps, FacetedFilter } from './FacetedFilter'

export interface DataTableToolbarProps<TData, TValue> {
  table: Table<TData>
  filterAccessor?: keyof TData
  chooseFilters?: {
    accessor: keyof TData
    title: string
    options: DataTableFacetedFilterProps<TData, TValue>['options']
  }[]
}

export function TableToolbar<TData, TValue>({ table, filterAccessor, chooseFilters }: DataTableToolbarProps<TData, TValue>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {filterAccessor && (
          <Input
            placeholder="Filter data..."
            value={(table.getColumn(String(filterAccessor))?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(String(filterAccessor))?.setFilterValue(event.target.value)}
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        {chooseFilters &&
          chooseFilters.map(
            (entry) =>
              table.getColumn(String(entry.accessor)) && (
                <FacetedFilter
                  key={String(entry.accessor)}
                  column={table.getColumn(String(entry.accessor))}
                  title={entry.title}
                  options={entry.options}
                />
              ),
          )}
        {isFiltered && (
          <Button variant={'ghost'} size={'icon'} onClick={() => table.resetColumnFilters()}>
            <Icons.close />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  )
}
