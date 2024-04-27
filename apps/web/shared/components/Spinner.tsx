import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

const spinnerVariants = cva('', {
	variants: {
		size: {
			default: 'w-10 h-10',
			sm: 'w-7 h-7',
			lg: 'w-16 h-16',
		},
	},
	defaultVariants: {
		size: 'default',
	},
})

export interface SpinnerProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size, className, ...props }: SpinnerProps) => {
	return (
		<div className={cn('flex-grow h-full w-full flex-center', className)} {...props}>
			<Icons.Spinner className={cn(spinnerVariants({ size }))} />
		</div>
	)
}
