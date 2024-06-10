import { ConnectorProperty, Validators } from '@linkerry/connectors-framework'
import { createContext, useContext, useMemo, useState } from 'react'
import { FieldValues, RegisterOptions, Validate } from 'react-hook-form'

interface DynamicFieldContextValue {
  useDynamicValue: boolean
  setUseDynamicValue: React.Dispatch<React.SetStateAction<boolean>>
  validate: Record<string, Validate<any, FieldValues>>
  rules: Omit<RegisterOptions, 'disabled' | 'valueAsNumber' | 'valueAsDate' | 'setValueAs'>
  canUseDynamicValue: boolean
}

const DynamicFieldContext = createContext<DynamicFieldContextValue | undefined>(undefined)

interface DynamicFieldProviderProps {
  children: React.ReactNode
  property: ConnectorProperty
  canUseDynamicValue?: boolean
}

export const DynamicFieldProvider = ({ children, property, canUseDynamicValue = true }: DynamicFieldProviderProps) => {
  const [useDynamicValue, setUseDynamicValue] = useState(false)

  const validate = useMemo(() => {
    if (useDynamicValue) return {}

    const output: RegisterOptions['validate'] = {}
    for (const validator of property.validators?.concat(...(property.defaultValidators ?? [])) ?? []) {
      if (!validator.validatorName) continue
      output[validator.validatorName] = (value) => {
        // @ts-expect-error fix in future
        const validatorEntry = Validators[validator.validatorName]
        if (typeof validatorEntry === 'function') return validatorEntry(...(validator.args ?? [])).fn(property, value, value)
        return validatorEntry.fn(property, value, value)
      }
    }
    return output
  }, [property.validators, property.defaultValidators, useDynamicValue])

  const rules = useMemo<Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>>(() => {
    return {
      required: { value: property.required, message: 'Required field' },
      validate,
    }
  }, [property.required, validate])

  return (
    <DynamicFieldContext.Provider
      value={{
        useDynamicValue,
        setUseDynamicValue,
        validate,
        rules,
        canUseDynamicValue
      }}
    >
      {children}
    </DynamicFieldContext.Provider>
  )
}

export const useDynamicField = () => {
  const context = useContext(DynamicFieldContext)
  if (!context) {
    throw new Error('useDynamicField must be used within a UserProvider')
  }
  return context
}
