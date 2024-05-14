import { ConnectorProperty, ShortTextProperty } from '@linkerry/connectors-framework'
import { hasVariableToken, isNil } from '@linkerry/shared'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

interface ShortTextFieldProps {
  property: ShortTextProperty
  name: string
  refreshedProperties: ConnectorProperty[]
}

export const ShortTextField = ({ property, name, refreshedProperties }: ShortTextFieldProps) => {
  const { control, trigger, getValues } = useFormContext()
  const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField({
    property,
  })

  useEffect(() => {
    trigger(name)

    const value = getValues(name)
    if (isNil(value)) return
    else if (hasVariableToken(value)) {
      setUseDynamicValue(true)
    }
  }, [])

  return <DynamicValueField name={name} property={property} setUseDynamicValue={setUseDynamicValue} showDynamicValueButton={false} />
}
