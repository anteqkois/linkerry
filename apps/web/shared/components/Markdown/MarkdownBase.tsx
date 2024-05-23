import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import Markdown, { Options } from 'react-markdown'

const markdownBaseVariants = cva('markdown w-full rounded-md border border-dashed border-input bg-card p-3 text-sm shadow-sm', {
  variants: {
    variant: {
      default: '',
      // destructive: 'bg-destructive/70 text-destructive-foreground hover:bg-destructive/90',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface MarkdownBaseProps extends Options, VariantProps<typeof markdownBaseVariants> {
  children: string
}

export const MarkdownBase = ({ children, className, variant, ...props }: MarkdownBaseProps) => {
  return (
    <Markdown className={cn(markdownBaseVariants({ variant }), className)} {...props}>
      {children}
    </Markdown>
  )
}
