import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'

export interface GenerateTestDataButtonProps extends HTMLAttributes<HTMLButtonElement> {
	disabled: boolean
	disabledMessage: string
	text: string
	loading: boolean
}

export const GenerateTestDataButton = ({ disabled, disabledMessage, text, loading, onClick }: GenerateTestDataButtonProps) => {
	return (
		<TooltipProvider delayDuration={200}>
			<Tooltip>
				<TooltipTrigger disabled={!disabled} asChild>
					<Button variant="secondary" onClick={onClick} disabled={disabled} size={'sm'}>
						{loading ? <Icons.Spinner size={'xs'} className="mr-3" /> : <Icons.Test size={'xs'} className="mr-3 animate-pulse" />}
						<span className="whitespace-nowrap">{text}</span>
					</Button>
				</TooltipTrigger>
				{disabled ? (
					<TooltipContent>
						<p>{disabledMessage}</p>
					</TooltipContent>
				) : null}
			</Tooltip>
		</TooltipProvider>
	)
}
