import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@market-connector/ui-components/client'
import { Card, CardContent, Icons } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

const baseNodeVariants = cva('w-editor-element border-2 border-primary/50 cursor-pointer', {
  variants: {
    valid: {
      true: '',
      false: 'border-dashed',
    },
    color: {
      primary: 'outline-primary/50',
    },
  },
  defaultVariants: {
    valid: false,
    color: 'primary',
  },
})

interface BaseProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof baseNodeVariants> {
  valid: boolean
  invalidMessage: string
  title: string
  onClick: NonNullable<HTMLAttributes<HTMLDivElement>['onClick']>
}

export const BaseNodeElement = ({ children, title, onClick, valid, invalidMessage, color }: BaseProps) => {
  return (
    <Card className={cn(baseNodeVariants({ valid, color }), 'hover:outline outline-2 hover:border-solid')} onClick={onClick}>
      {/* {title && (
        <CardHeader>
          <CardTitle className="flex gap-2 items-center text-primary">{title}</CardTitle>
        </CardHeader>
      )} */}
      <CardContent className='p-6'>{children}</CardContent>
      {!valid && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger className="text-destructive absolute bottom-2 right-3">
              <Icons.warn />
            </TooltipTrigger>
            <TooltipContent side="bottom" align="start" asChild>
              <p>{invalidMessage}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
    </Card>
  )
}
