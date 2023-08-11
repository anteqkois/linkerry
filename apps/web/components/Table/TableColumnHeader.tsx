import { Button, Icons } from '@market-connector/ui-components/server'
import { Column } from '@tanstack/react-table'

export const TableColumnHeader = <TColumn,>({
  column,
  title,
  sortable = false,
}: {
  column: Column<TColumn>
  title: string
  sortable?: boolean
}) => {
  return sortable ? (
    <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <Icons.sort className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    <div className="text-right">{title}</div>
  )
}
