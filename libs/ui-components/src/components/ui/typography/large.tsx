import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../lib/utils'

const largeVariants = cva('', {
  variants: {
    variant: {
      default: 'text-lg font-semibold',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface LargeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof largeVariants> {
  asChild?: boolean
}

const Large = React.forwardRef<HTMLParagraphElement, LargeProps>(({ className, variant, asChild = false, ...props }, ref) => {
  return <div className={cn(largeVariants({ variant, className }))} ref={ref} {...props} />
})
Large.displayName = 'Large'

export { Large, largeVariants }
