import { ConnectorProperty, DropdownOption, PropertyType, StaticDropdownProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@linkerry/ui-components/client'
import { HTMLAttributes, useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { VList } from 'virtua'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

export interface VirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
  property: StaticDropdownProperty
  name: string
  refreshedProperties: ConnectorProperty[]
  type?: PropertyType.STATIC_DROPDOWN | PropertyType.DYNAMIC_DROPDOWN
  initData?: DropdownOption<any>
}

export const VirtualizedSelect = ({ property, initData, name, refreshedProperties, type = PropertyType.STATIC_DROPDOWN }: VirtualizedSelectProps) => {
  const { setValue, control, getValues, trigger } = useFormContext()
  const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField()

  // setup temp field which holds String value based on started value from database
  useEffect(() => {
    const startedValueString = JSON.stringify(getValues(name) || '')
    if (!startedValueString) return
    const selectedOption = property.options.options.find((option) => JSON.stringify(option.value) === startedValueString)
    if (selectedOption) setValue(`__temp__${name}`, selectedOption.label)
    else if (hasVariableToken(startedValueString)) {
      setUseDynamicValue(true)
    }
  }, [])

  useEffect(() => {
    if (!initData?.label) return

    setValue(name, initData.value)
    setValue(`__temp__${name}`, initData.label)
    trigger(name)
  }, [initData])

  const selectHeight = useMemo(() => {
    if (!property.options.options.length) return 10
    return Math.min(500, property.options.options.length * 32)
  }, [property.options.options])

  const onChangeValue = (newLabel: string) => {
    const value = property.options.options.find((option) => option.label === newLabel)
    setValue(name, value?.value)
  }

  return useDynamicValue ? (
    <DynamicValueField
      name={name}
      property={{ ...property, type } as ConnectorProperty}
      showDynamicValueButton={true}
    />
  ) : (
    <FormField
      control={control}
      name={`__temp__${name}`}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <PropertyLabel property={property} refreshedProperties={refreshedProperties} />
          <FormControl>
            <Select
              value={field.value}
              disabled={property.options.disabled}
              onValueChange={async (newValue) => {
                onChangeValue(newValue)
                field.onChange(newValue)
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder={property.options.placeholder} aria-label={field.value} />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-96 overflow-scroll">
                <VList style={{ height: selectHeight }}>
                  {property.options.options.map((option) => (
                    <SelectItem value={option.label} key={option.value}>
                      <span className="flex gap-2 items-center">
                        <p>{option.label}</p>
                      </span>
                    </SelectItem>
                  ))}
                </VList>
              </SelectContent>
            </Select>
          </FormControl>
          <PropertyDescription>{property.description}</PropertyDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
