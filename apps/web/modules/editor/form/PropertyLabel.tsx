import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormLabel, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { useDynamicField } from './useFieldCustomValidation'

export interface PropertyLabelProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
  refreshedProperties: ConnectorProperty[]
  property: ConnectorProperty
}

export const PropertyLabel = ({ property, refreshedProperties }: PropertyLabelProps) => {
  const { setUseDynamicValue, canUseDynamicValue } = useDynamicField()

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
                    <span key={property.displayName} className="font-black">
                      &quot;
                      {property.displayName}
                      &quot;
                    </span>
                  ))}
                  . If you change &quot;
                  <span className="font-black">{property.displayName}</span>
                  &quot; to a dynamic value, this property isn&apos;t be required.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : null}

        {canUseDynamicValue ? (
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger onClick={() => setUseDynamicValue(true)} className="opacity-50  hover:opacity-100">
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
