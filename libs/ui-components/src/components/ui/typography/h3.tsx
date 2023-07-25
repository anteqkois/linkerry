import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../lib/utils'

const h3Variants = cva('', {
  variants: {
    variant: {
      default: 'scroll-m-20 text-2xl font-semibold tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface H3Props extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof h3Variants> {
  asChild?: boolean
}

const H3 = React.forwardRef<HTMLHeadingElement, H3Props>(({ className, variant, asChild = false, ...props }, ref) => {
  return <h3 className={cn(h3Variants({ variant, className }))} ref={ref} {...props} />
})
H3.displayName = 'H3'

export { H3, h3Variants }
