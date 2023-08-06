import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const h4Variants = cva('', {
  variants: {
    variant: {
      default: 'scroll-m-20 text-xl font-semibold tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface H4Props extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof h4Variants> {
  asChild?: boolean
}

const H4 = React.forwardRef<HTMLHeadingElement, H4Props>(({ className, variant, asChild = false, ...props }, ref) => {
  return <h4 className={cn(h4Variants({ variant, className }))} ref={ref} {...props} />
})
H4.displayName = 'H4'

export { H4, h4Variants }
