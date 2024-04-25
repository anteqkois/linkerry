import { Popover, PopoverContent, PopoverTrigger } from '@linkerry/ui-components/client'
import { ParamHTMLAttributes, useState } from 'react'

export interface PropertyDescriptionProps extends ParamHTMLAttributes<HTMLParagraphElement> {}

export const PropertyDescription = ({ children }: PropertyDescriptionProps) => {
	const [open, setOpen] = useState(true)

	return (
		<Popover open={open} onOpenChange={setOpen} defaultOpen={true}>
			<PopoverTrigger asChild >
				<p onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} className="text-xs text-muted-foreground h-4 truncate">
					{children}
				</p>
			</PopoverTrigger>
			<PopoverContent className="w-80" >
				{children}
			</PopoverContent>
		</Popover>
	)
}
