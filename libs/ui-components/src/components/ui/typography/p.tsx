import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const pVariants = cva('', {
  variants: {
    variant: {
      default: 'leading-7 [&:not(:first-child)]:mt-6',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface PProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof pVariants> {
  asChild?: boolean
}

const P = React.forwardRef<HTMLParagraphElement, PProps>(({ className, variant, asChild = false, ...props }, ref) => {
  return <p className={cn(pVariants({ variant }), className)} ref={ref} {...props} />
})
P.displayName = 'P'

export { P, pVariants }
