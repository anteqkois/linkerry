import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormLabel, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, SetStateAction } from 'react'

export interface PropertyLabelProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	refreshedProperties: ConnectorProperty[]
	property: ConnectorProperty
	setUseDynamicValue?: (value: SetStateAction<boolean>) => void
}

export const PropertyLabel = ({ property, refreshedProperties, setUseDynamicValue }: PropertyLabelProps) => {
	return (
		<FormLabel className="flex justify-between">
			<p>{property.displayName}</p>
			<div>
				{refreshedProperties.length ? (
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
				) : null}

				{setUseDynamicValue ? (
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger onClick={() => setUseDynamicValue(true)} className="text-primary-foreground/40 hover:text-primary-foreground">
								<Icons.Power size={'sm'} className="mb-1 mr-2" />
							</TooltipTrigger>
							<TooltipContent side="bottom" align="start">
								<p>Switch to use dynamic value</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				) : null}
			</div>
		</FormLabel>
	)
}
