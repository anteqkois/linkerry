import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface MacOSWindowProps extends HTMLAttributes<HTMLElement> {}

export const MacOSWindow = ({ children, className }: MacOSWindowProps) => {
  return (
    <div className={cn('rounded-md border bg-popover text-popover-foreground shadow', className)}>
      <div className="p-0.5 md:p-1.5 min-w-full bg-muted flex gap-1 md:gap-1.5 items-center">
        <span className="inline-block h-1 w-1 md:h-2 md:w-2 bg-red-400 rounded-full" />
        <span className="inline-block h-1 w-1 md:h-2 md:w-2 bg-yellow-400 rounded-full" />
        <span className="inline-block h-1 w-1 md:h-2 md:w-2 bg-green-400 rounded-full" />
      </div>
      {children}
    </div>
  )
}
