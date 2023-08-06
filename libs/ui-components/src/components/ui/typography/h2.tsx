import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const h2Variants = cva('', {
  variants: {
    variant: {
      default: 'scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface H2Props extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof h2Variants> {
  asChild?: boolean
}

const H2 = React.forwardRef<HTMLHeadingElement, H2Props>(({ className, variant, asChild = false, ...props }, ref) => {
  return <h2 className={cn(h2Variants({ variant, className }))} ref={ref} {...props} />
})
H2.displayName = 'H2'

export { H2, h2Variants }
