import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const leadVariants = cva('', {
  variants: {
    variant: {
      default: 'text-xl text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface LeadProps extends React.HTMLAttributes<HTMLParagraphElement>, VariantProps<typeof leadVariants> {
  asChild?: boolean
}

const Lead = React.forwardRef<HTMLParagraphElement, LeadProps>(({ className, variant, asChild = false, ...props }, ref) => {
  return <p className={cn(leadVariants({ variant, className }))} ref={ref} {...props} />
})
Lead.displayName = 'Lead'

export { Lead, leadVariants }
