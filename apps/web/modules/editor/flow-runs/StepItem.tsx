import { ConnectorMetadata } from '@linkerry/connectors-framework'
import { Action, StepOutput, StepOutputStatus, Trigger } from '@linkerry/shared'
import { Avatar, AvatarFallback, AvatarImage, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes } from 'react'

const StepStatus = ({ status, className }: { status: StepOutputStatus } & HTMLAttributes<HTMLElement>) => {
	if (status === StepOutputStatus.SUCCEEDED)
		return (
			<div className={cn(className)}>
				<Icons.Check className="text-positive" />
			</div>
		)
	else if (status === StepOutputStatus.FAILED)
		return (
			<div className={cn(className)}>
				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger>
							<Icons.False className="text-negative" />
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start" asChild>
							<p>Status - {status}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
	else if (status === StepOutputStatus.PAUSED)
		return (
			<div className={cn(className)}>
				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger>
							<Icons.Pause />
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start" asChild>
							<p>Flow run is paused - {status}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
	else if (status === StepOutputStatus.STOPPED)
		return (
			<div className={cn(className)}>
				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger>
							<Icons.Stop />
						</TooltipTrigger>
						<TooltipContent side="bottom" align="start" asChild>
							<p>The Flow run was stoped manually - {status}</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</div>
		)
}

export interface StepItemProps extends HTMLAttributes<HTMLElement> {
	step: Trigger | Action
	connectorMetadata: ConnectorMetadata
	result: StepOutput
	stepNumber: number
}

export const StepItem = ({ connectorMetadata, step, result, stepNumber }: StepItemProps) => {
	return (
		<div className="flex items-center">
			<Avatar className="h-9 w-9">
				<AvatarImage src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
				<AvatarFallback>{connectorMetadata.displayName[0].toUpperCase()}</AvatarFallback>
			</Avatar>
			<div className="ml-4 space-y-1">
				<p className="text-sm font-medium leading-none">
					{stepNumber}. {step.displayName}
				</p>
				<p className="text-sm text-muted-foreground">{connectorMetadata.displayName}</p>
			</div>
			<StepStatus className="ml-auto font-medium mr-1" status={result.status} />
		</div>
	)
}
