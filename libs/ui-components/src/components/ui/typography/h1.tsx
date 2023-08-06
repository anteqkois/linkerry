import { VariantProps, cva } from 'class-variance-authority'
import React from 'react'
import { cn } from '../../../utils'

const h1Variants = cva('', {
  variants: {
    variant: {
      default: 'scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl',
      // destructive:
      //   "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      // outline:
      //   "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      // secondary:
      //   "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      // ghost: "hover:bg-accent hover:text-accent-foreground",
      // link: "text-primary underline-offset-4 hover:underline",
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface H1Props extends React.HTMLAttributes<HTMLHeadingElement>, VariantProps<typeof h1Variants> {
  asChild?: boolean
}

const H1 = React.forwardRef<HTMLHeadingElement, H1Props>(({ className, variant, asChild = false, ...props }, ref) => {
  return <h1 className={cn(h1Variants({ variant, className }))} ref={ref} {...props} />
})
H1.displayName = 'H1'

export { H1, h1Variants }
