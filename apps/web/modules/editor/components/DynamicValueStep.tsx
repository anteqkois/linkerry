import { ConnectorMetadata } from '@linkerry/connectors-framework'
import { Step, isNil } from '@linkerry/shared'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@linkerry/ui-components/client'
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
				<HoverCard openDelay={200} closeDelay={100}>
					<HoverCardTrigger asChild>
						<div className="flex items-center p-2 overflow-hidden max-h-8 w-full">
							<Image width={24} height={24} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
							<div className="space-y-1">
								<p className="text-sm font-medium leading-none pl-2">
									{stepIndex + 1}. {step.displayName}
								</p>
							</div>
						</div>
					</HoverCardTrigger>
					<HoverCardContent side="top" align="start" sideOffset={10} className="overflow-scroll w-full max-w-xl max-h-96 p-2">
						{JSON.stringify(step.settings.inputUiInfo.currentSelectedData)}
					</HoverCardContent>
				</HoverCard>
				<div className="flex items-center p-0.5 px-2">
					<Button variant={'ghost'} size={'sm'}>
						Insert
					</Button>
					{typeof step.settings.inputUiInfo.currentSelectedData === 'object' && !isNil(step.settings.inputUiInfo.currentSelectedData) ? (
						<Button size={'icon'} variant={'ghost'} className="ml-1" onClick={() => setExpand((prev) => !prev)}>
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
