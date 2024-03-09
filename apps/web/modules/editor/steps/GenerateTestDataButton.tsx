import { ButtonClient, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
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
					<ButtonClient loading={loading} variant="secondary" onClick={onClick} disabled={disabled} size={'sm'}>
						<Icons.Test size={'xs'} className="mr-3 animate-pulse" />
						<span className="whitespace-nowrap">{text}</span>
					</ButtonClient>
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
