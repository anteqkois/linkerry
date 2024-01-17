import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HtmlHTMLAttributes } from 'react'

const buttonVariants = cva('container flex justify-center px-2 pt-14 h-screen w-screen lg:max-w-none', {
  variants: {
    padding: {
      default: 'px-2',
      none: 'px-0',
    },
  },
  defaultVariants: {
    padding: 'default',
  },
})

export interface PageProps extends HtmlHTMLAttributes<HTMLElement>, VariantProps<typeof buttonVariants> {}

export const PageContainer = ({ children, padding, className }: PageProps) => {
  return <main className={cn(buttonVariants({ padding }), className)}>{children}</main>
}
