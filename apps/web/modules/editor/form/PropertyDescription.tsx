import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { ParamHTMLAttributes } from 'react'

export interface PropertyDescriptionProps extends ParamHTMLAttributes<HTMLParagraphElement> {}

export const PropertyDescription = ({ children }: PropertyDescriptionProps) => {
	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger asChild>
					<p className="text-xs text-muted-foreground h-4 truncate">{children}</p>
				</TooltipTrigger>
				<TooltipContent side="bottom" align="start" asChild>
					<p>{children}</p>
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	)
}
