import { ConnectorProperty, SecretTextProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'

interface SecretTextFieldProps {
  property: SecretTextProperty
  name: string
  refreshedProperties: ConnectorProperty[]
}

export const SecretTextField = ({ property, name, refreshedProperties }: SecretTextFieldProps) => {
  const { control, trigger } = useFormContext()
  const { rules } = useDynamicField()

  useEffect(() => {
    trigger(name)
  }, [])

  return (
    <FormField
      control={control}
      name={name}
      defaultValue={''}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <PropertyLabel property={property} refreshedProperties={refreshedProperties} />
          <FormControl>
            <Input {...field} type="password" />
          </FormControl>
          <PropertyDescription>{property.description}</PropertyDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
