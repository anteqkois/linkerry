import { ConnectorMetadata } from '@linkerry/connectors-framework'
import { Step, isNil } from '@linkerry/shared'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import Image from 'next/image'
import { HTMLAttributes, useState } from 'react'
import { DynamicValueEntry } from './DynamicValueEntry'

export interface DynamicValueStepProps extends HTMLAttributes<HTMLElement> {
	step: Step
	connectorMetadata: ConnectorMetadata
	stepIndex: number
}

export const DynamicValueStep = ({ connectorMetadata, step, stepIndex }: DynamicValueStepProps) => {
	const [expand, setExpand] = useState(false)

	return (
		<>
			<div
				className="flex items-center justify-between cursor-pointer hover:bg-accent/50 hover:text-accent-foreground focus:bg-accent/50 focus:text-accent-foreground"
				// onClick={() => onSelectStep(stepIndex)}
			>
				<TooltipProvider delayDuration={50}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="flex items-center p-2 overflow-hidden max-h-8 w-full">
								<Image width={24} height={24} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
								<div className="space-y-1">
									<p className="text-sm font-medium leading-none pl-2">
										{stepIndex + 1}. {step.displayName}
									</p>
								</div>
							</div>
						</TooltipTrigger>
						<TooltipContent side="top" align="start" asChild>
							<p>{JSON.stringify(step.settings.inputUiInfo.currentSelectedData)}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<div className="flex items-center p-0.5 px-2">
					<Button variant={'outline'} size={'sm'}>
						Insert
					</Button>
					{typeof step.settings.inputUiInfo.currentSelectedData === 'object' && !isNil(step.settings.inputUiInfo.currentSelectedData) ? (
						<Button size={'icon'} variant={'outline'} className="ml-1" onClick={() => setExpand((prev) => !prev)}>
							{expand ? <Icons.ArrowDown /> : <Icons.ArrowRight />}
						</Button>
					) : null}
				</div>
			</div>
			{expand
				? Object.entries(step.settings.inputUiInfo.currentSelectedData).map(([keyName, value], index) => (
						<DynamicValueEntry key={keyName + index} keyName={keyName} value={value} deepLevel={0} />
				  ))
				: null}
		</>
	)
}
