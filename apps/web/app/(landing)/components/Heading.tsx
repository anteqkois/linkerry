import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface HeadingProps extends HTMLAttributes<HTMLElement> {}

export const Heading = ({ children, className }: HeadingProps) => {
  return <h2 className={cn("text-center text-4xl lg:text-5xl font-semibold transition-colorstext-center text-muted-foreground", className)}>{children}</h2>
}
