import { CheckboxProperty, ConnectorProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import { Checkbox, FormControl, FormField, FormItem } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

interface CheckboxFieldProps {
  property: CheckboxProperty
  name: string
  refreshedProperties: ConnectorProperty[]
}

export const CheckboxField = ({ property, name, refreshedProperties }: CheckboxFieldProps) => {
  const { control, trigger, getValues } = useFormContext()
  const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField()

  useEffect(() => {
    trigger(name)

    const value = getValues(name)
    if (typeof value !== 'string') return
    else if (hasVariableToken(value)) {
      setUseDynamicValue(true)
    }
  }, [])

  return useDynamicValue ? (
    <DynamicValueField name={name} property={property} showDynamicValueButton={true} />
  ) : (
    <FormField
      control={control}
      name={name}
      rules={{ ...rules, required: false }}
      render={({ field }) => (
        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pl-1">
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none flex-grow">
            <PropertyLabel property={property} refreshedProperties={refreshedProperties} />
            <PropertyDescription>{property.description}</PropertyDescription>
          </div>
        </FormItem>
      )}
    />
  )
}
