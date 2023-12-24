import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const h5Variants = cva('', {
  variants: {
    variant: {
      default: 'scroll-m-20 text-lg font-semibold tracking-tight',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface H5Props extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof h5Variants> {
  asChild?: boolean
}

const H5 = React.forwardRef<HTMLHeadingElement, H5Props>(({ className, variant, asChild = false, ...props }, ref) => {
  return <h5 className={cn(h5Variants({ variant, className }))} ref={ref} {...props} />
})
H5.displayName = 'H5'

export { H5, h5Variants }
