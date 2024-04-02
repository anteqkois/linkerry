import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormLabel, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'

export interface PropertyLabelProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	refreshedProperties: ConnectorProperty[]
	property: ConnectorProperty
}

export const PropertyLabel = ({ property, refreshedProperties }: PropertyLabelProps) => {
	return !refreshedProperties.length ? (
		<FormLabel >{property.displayName}</FormLabel>
	) : (
		<div className="flex justify-between">
			<FormLabel>{property.displayName}</FormLabel>
			<TooltipProvider delayDuration={100}>
				<Tooltip>
					<TooltipTrigger className="cursor-default">
						<Icons.Update size={'sm'} className="mb-1 mr-2 text-primary-foreground/50" />
					</TooltipTrigger>
					<TooltipContent side="bottom" align="start">
						<p>
							This property is a refresher for other properties:{' '}
							{refreshedProperties.map((property) => (
								<>
									&quot;
									<span key={property.displayName} className="font-black">
										{property.displayName}
									</span>
									&quot;
								</>
							))}
							. If you change &quot;
							<span className="font-black">{property.displayName}</span>
							&quot; to a dynamic value, this property isn&apos;t be required.
						</p>
					</TooltipContent>
				</Tooltip>
			</TooltipProvider>
		</div>
	)
}
