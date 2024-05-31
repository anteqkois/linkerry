import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface KeyValueItemProps extends HTMLAttributes<HTMLElement> {
  label: string | JSX.Element
  value: string | number
}

export const KeyValueItem = ({ label, value, className }: KeyValueItemProps) => {
  return (
    <p className={cn('flex justify-between hover:bg-accent hover:text-accent-foreground py-0.5 px-2 rounded-md', className)}>
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
    </p>
  )
}
