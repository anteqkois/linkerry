import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { ParamHTMLAttributes, useState } from 'react'

export interface PropertyDescriptionProps extends ParamHTMLAttributes<HTMLParagraphElement> {}

export const PropertyDescription = ({ children }: PropertyDescriptionProps) => {
  const [open, setOpen] = useState(true)

  return children ? (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-xs text-muted-foreground h-4 truncate">{children}</p>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="start" className="max-w-sm">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : null
  // return children ? (
  // 	<Popover open={open} onOpenChange={setOpen} defaultOpen={true}>
  // 		<PopoverTrigger asChild>
  // 			<p onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="text-xs text-muted-foreground h-4 truncate">
  // 				{children}
  // 			</p>
  // 		</PopoverTrigger>
  // 		<PopoverContent className="w-80">{children}</PopoverContent>
  // 	</Popover>
  // ) : null
}
