import { ConnectorProperty, LongTextProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import { FormControl, FormField, FormItem, FormMessage, Textarea } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

interface LongTextFieldProps {
  property: LongTextProperty
  name: string
  refreshedProperties: ConnectorProperty[]
}

export const LongTextField = ({ property, name, refreshedProperties }: LongTextFieldProps) => {
  const { control, trigger, getValues } = useFormContext()
  const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField({
    property,
  })

  useEffect(() => {
    trigger(name)

    const value = getValues(name)
    if (typeof value !== 'string') return
    else if (hasVariableToken(value)) {
      setUseDynamicValue(true)
    }
  }, [])

  return useDynamicValue ? (
    <DynamicValueField name={name} property={property} setUseDynamicValue={setUseDynamicValue} showDynamicValueButton={true} />
  ) : (
    <FormField
      control={control}
      name={name}
      defaultValue={''}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <PropertyLabel property={property} refreshedProperties={refreshedProperties} setUseDynamicValue={setUseDynamicValue} />
          <FormControl>
            <Textarea {...field} />
          </FormControl>
          <PropertyDescription>{property.description}</PropertyDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
