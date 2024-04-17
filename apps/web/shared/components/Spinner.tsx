import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

export interface SpinnerProps extends HTMLAttributes<HTMLElement> {}

export const Spinner = ({ ...props }: SpinnerProps = {}) => {
	return (
		// <div className="grid items-center justify-center h-screen w-screen">
		// <div className={cn('flex-grow grid items-center justify-center h-full w-full', props.className)} {...props}>
		<div className={cn('flex-grow h-full w-full flex-center', props.className)} {...props}>
			<Icons.Spinner className="w-10 h-10" />
		</div>
	)
}
