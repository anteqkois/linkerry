import * as React from 'react'

import { VariantProps, cva } from 'class-variance-authority'
import { cn } from '../../utils'
import { Icons } from './icons'

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="w-full overflow-auto">
    <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
  </div>
))
Table.displayName = 'Table'

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
))
TableHeader.displayName = 'TableHeader'

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
))
TableBody.displayName = 'TableBody'

const TableFooter = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tfoot ref={ref} className={cn('bg-primary font-medium text-primary-foreground', className)} {...props} />
))
TableFooter.displayName = 'TableFooter'

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn('border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted', className)} {...props} />
))
TableRow.displayName = 'TableRow'

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      'h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      className,
    )}
    {...props}
  />
))
TableHead.displayName = 'TableHead'

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn('p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)} {...props} />
))
TableCell.displayName = 'TableCell'

const tableCellContentVariants = cva('font-medium', {
  variants: {
    variant: {
      default: '',
      muted: 'p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
      boolean: 'flex justify-center',
    },
    position: {
      default: '',
      sortable: 'pl-4',
      centered: 'flex justify-center',
    },
  },
  defaultVariants: {
    variant: 'default',
    position: 'default',
  },
})

export interface TableCellContentProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tableCellContentVariants> {}

const TableCellContent = React.forwardRef<HTMLDivElement, TableCellContentProps>(({ className, variant, position, children, ...props }, ref) => (
  <div ref={ref} className={cn(tableCellContentVariants({ variant, position, className }))} {...props}>
    {variant !== 'boolean' ? (
      children
    ) : children ? (
      <Icons.True className="h-6 w-6 text-positive" />
    ) : (
      <Icons.False className="h-6 w-6 text-destructive" />
    )}
  </div>
))

TableCellContent.displayName = 'TableCellContent'

const TableCaption = React.forwardRef<HTMLTableCaptionElement, React.HTMLAttributes<HTMLTableCaptionElement>>(({ className, ...props }, ref) => (
  <caption ref={ref} className={cn('mt-4 text-sm text-muted-foreground', className)} {...props} />
))
TableCaption.displayName = 'TableCaption'

export { Table, TableBody, TableCaption, TableCell, TableCellContent, TableFooter, TableHead, TableHeader, TableRow }
