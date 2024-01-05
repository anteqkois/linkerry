import { Button, Icons } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { Column } from '@tanstack/react-table'

export const TableColumnHeader = <TColumn,>({
  column,
  title,
  sortable = false,
  className,
}: {
  column: Column<TColumn>
  title: string
  sortable?: boolean
  className?: string
}) => {
  return sortable ? (
    <Button variant="ghost"  size={'sm'} className={cn('pr-0', className)} onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
      {title}
      <Icons.Sort className="ml-2 h-4 w-4" />
    </Button>
  ) : (
    <div className="text-right">{title}</div>
  )
}
