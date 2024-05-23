'use client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface WarningInfoProps extends HTMLAttributes<HTMLElement> {
  // message: string
}

export const WarningInfo = ({ children, className }: WarningInfoProps) => {
  return (
    <div className={cn('p-2 text-warning bg-warning-foreground border-2 rounded-md border-warning/50 border-dashed', className)}>
      <div className="flex items-center gap-2 font-bold">
        <Icons.Warn />
        Warning!
      </div>
      {children}
    </div>
  )
}
