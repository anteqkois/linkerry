import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
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
	if (!sortable || !column.getCanSort()) {
		return <div className={cn('text-left', className)}>{title}</div>
	}

	return (
		<div className={cn('flex items-center space-x-2', className)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="sm" className="-ml-3 h-8 data-[state=open]:bg-accent">
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<Icons.ArrowDown className="ml-2 h-4 w-4" />
						) : column.getIsSorted() === 'asc' ? (
							<Icons.ArrowUp className="ml-2 h-4 w-4" />
						) : (
							<Icons.Sort className="ml-2 h-4 w-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<Icons.ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<Icons.ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={() => column.clearSorting()}>
						<Icons.Sort className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Reset
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
