import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const mutedVariants = cva('', {
  variants: {
    variant: {
      default: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface MutedProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof mutedVariants> {
  asChild?: boolean
}

const Muted = React.forwardRef<HTMLParagraphElement, MutedProps>(({ className, variant, asChild = false, ...props }, ref) => {
  return <div className={cn(mutedVariants({ variant, className }))} ref={ref} {...props} />
})
Muted.displayName = 'Muted'

export { Muted, mutedVariants }
