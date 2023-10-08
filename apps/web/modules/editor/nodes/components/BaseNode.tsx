import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@market-connector/ui-components/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Icons } from '@market-connector/ui-components/server'
import { cn } from '@market-connector/ui-components/utils'
import { cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

interface BaseProps extends HTMLAttributes<HTMLDivElement> {
  description: string
  valid: boolean
  invalidMessage: string
  title: string
  onClick: NonNullable<HTMLAttributes<HTMLDivElement>['onClick']>
}

const variants = cva('w-editor-element border-2 border-primary/50 cursor-pointer flex flex-row relative hover:', {
  variants: {
    valid: {
      true: '',
      false: 'border-dashed',
    },
  },
  defaultVariants: {
    valid: false,
  },
})

export const BaseNodeElement = ({ description, title, onClick, valid, invalidMessage }: BaseProps) => {
  return (
    <Card className={cn(variants({ valid }), 'hover:outline outline-2 outline-primary/50 hover:border-solid')} onClick={onClick}>
      <CardHeader>
        <CardTitle className="flex gap-2 items-center text-primary">
          <Icons.strategy /> {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent></CardContent>
      {!valid && (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger>
              <Icons.warn className="text-destructive absolute bottom-2 right-3" />
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
