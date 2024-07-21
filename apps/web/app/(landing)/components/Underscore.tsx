import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface UnderscoreProps extends HTMLAttributes<HTMLElement> {}

export const Underscore = ({className, ...props}: UnderscoreProps) => {
  return (
    <div className="relative">
      <span
        className={cn('absolute inset-x-0 -bottom-2 h-1 bg-gradient-to-r from-purple-500/0 via-purple-500/70 to-purple-500/0', className)}
        {...props}
      ></span>
    </div>
  )
}
