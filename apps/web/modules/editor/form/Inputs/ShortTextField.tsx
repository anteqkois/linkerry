import { ConnectorProperty, ShortTextProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
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
  const { trigger, getValues } = useFormContext()
  const { setUseDynamicValue } = useDynamicField()

  useEffect(() => {
    trigger(name)

    const value = getValues(name)
    if (typeof value !== 'string') return
    else if (hasVariableToken(value)) {
      setUseDynamicValue(true)
    }
  }, [])

  return <DynamicValueField name={name} property={property} showDynamicValueButton={false} />
}
