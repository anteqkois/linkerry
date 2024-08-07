import { ConnectorProperty, JsonProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import { FormControl, FormField, FormItem, FormMessage } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { prepareCodeMirrorValue } from '../../../../libs/code-mirror'
import { CodeEditor } from '../../../../shared/components'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

interface JsonFieldProps {
  property: JsonProperty<any>
  name: string
  refreshedProperties: ConnectorProperty[]
}

export const JsonField = ({ property, name, refreshedProperties }: JsonFieldProps) => {
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
      defaultValue={''}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <PropertyLabel property={property} refreshedProperties={refreshedProperties} />
          <FormControl>
            <CodeEditor
              value={prepareCodeMirrorValue(field.value)}
              title={property.displayName}
              readOnly={false}
              heightPx={200}
              onChange={field.onChange}
            />
          </FormControl>
          <PropertyDescription>{property.description}</PropertyDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
