import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const smallVariants = cva('', {
  variants: {
    variant: {
      default: 'text-sm font-medium leading-none',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface SmallProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof smallVariants> {
  asChild?: boolean
}

const Small = React.forwardRef<HTMLParagraphElement, SmallProps>(({ className, variant, asChild = false, ...props }, ref) => {
  return <div className={cn(smallVariants({ variant, className }))} ref={ref} {...props} />
})
Small.displayName = 'Small'

export { Small, smallVariants }
