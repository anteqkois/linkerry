import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface ConfigurationItemProps extends HTMLAttributes<HTMLElement> {
	label: string
	value: string | number
}

export const ConfigurationItem = ({ label, value, className }: ConfigurationItemProps) => {
	return (
		<p className={cn('flex justify-between hover:bg-accent hover:text-accent-foreground py-0.5 px-2 rounded-md', className)}>
			<span className="text-muted-foreground">{label}:</span>
			<span>{value}</span>
		</p>
	)
}
