import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface MacOSWindowProps extends HTMLAttributes<HTMLElement> {}

export const MacOSWindow = ({ children }: MacOSWindowProps) => {
  return (
    <div className={cn('rounded-md border bg-popover text-popover-foreground shadow')}>
      <div className="p-1.5  min-w-full bg-muted flex gap-1.5 items-center">
        <span className="inline-block h-2 w-2 bg-red-400 rounded-full" />
        <span className="inline-block h-2 w-2 bg-yellow-400 rounded-full" />
        <span className="inline-block h-2 w-2 bg-green-400 rounded-full" />
      </div>
      {children}
    </div>
    // <div className={cn('rounded-md border bg-popover text-popover-foreground shadow')}>
    //   <div className="p-1.5  min-w-full bg-muted flex gap-1.5 items-center">
    //     <span className="inline-block h-3 w-3 bg-red-400 rounded-full" />
    //     <span className="inline-block h-3 w-3 bg-yellow-400 rounded-full" />
    //     <span className="inline-block h-3 w-3 bg-green-400 rounded-full" />
    //   </div>
    //   {children}
    // </div>
  )
}
