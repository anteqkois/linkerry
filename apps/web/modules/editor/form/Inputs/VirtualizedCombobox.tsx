import { ConnectorProperty, DropdownOption, PropertyType, StaticDropdownProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { HTMLAttributes, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Virtualizer } from 'virtua'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

export interface VirtualizedComboboxProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
  property: StaticDropdownProperty
  name: string
  refreshedProperties: ConnectorProperty[]
  type?: PropertyType.STATIC_DROPDOWN | PropertyType.DYNAMIC_DROPDOWN
  initData?: DropdownOption<any>
}

export const VirtualizedCombobox = ({
  property,
  initData,
  name,
  refreshedProperties,
  type = PropertyType.STATIC_DROPDOWN,
}: VirtualizedComboboxProps) => {
  const { setValue, control, getValues, trigger } = useFormContext()
  const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField({
    property,
  })
  const ref = useRef<HTMLDivElement>(null)
  const [searchValue, setSearchValue] = useState('')

  const filtered = useMemo(() => {
    if (!searchValue) return property.options.options
    const normalizedValue = searchValue.toLowerCase()
    return property.options.options.filter((t) => t.label.toLowerCase().includes(normalizedValue))
  }, [searchValue, property.options.options])

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
      setUseDynamicValue={setUseDynamicValue}
      showDynamicValueButton={true}
    />
  ) : (
    <FormField
      control={control}
      name={`__temp__${name}`}
      rules={rules}
      render={({ field }) => (
        <FormItem>
          <PropertyLabel property={property} refreshedProperties={refreshedProperties} setUseDynamicValue={setUseDynamicValue} />
          <FormControl>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn('justify-between w-full h-9 px-3 hover:bg-inherit', !field.value && 'text-muted-foreground')}
                  >
                    {field.value ?? property.options.placeholder ?? 'Select value'}
                    <Icons.Sort className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="p-0 w-100" align="start">
                <Command value={field.value}>
                  <CommandInput placeholder="Search..." className="h-9" value={searchValue} onValueChange={setSearchValue} />
                  {!filtered.length ? <CommandEmpty>No option found.</CommandEmpty> : null}
                  <CommandList ref={ref} style={{ height: selectHeight }}>
                    <Virtualizer scrollRef={ref}>
                      {filtered.map((option) => (
                        <p
                          key={option.value}
                          onClick={() => {
                            onChangeValue(option.value)
                            field.onChange(option.value)
                          }}
                          className={cn(
                            'cursor-pointer relative flex select-none items-center rounded-sm py-1.5 pl-2 pr-3 text-sm outline-none aria-selected:bg-accent aria-selected:text-accent-foreground hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
                            option.label === field.value && 'bg-accent text-accent-foreground',
                          )}
                        >
                          {option.label}
                          <Icons.Check className={cn('ml-auto h-4 w-4', option.label === field.value ? 'opacity-100' : 'opacity-0')} />
                        </p>
                        // <CommandItem
                        // value={option.label}
                        //   key={option.value}
                        //   onSelect={() => {
                        //     onChangeValue(option.value)
                        //     field.onChange(option.value)
                        //   }}
                        //   className="cursor-pointer"
                        // >
                        //   {option.label}
                        //   <Icons.Check className={cn('ml-auto h-4 w-4', option.label === field.value ? 'opacity-100' : 'opacity-0')} />
                        // </CommandItem>
                      ))}
                    </Virtualizer>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <PropertyDescription>{property.description}</PropertyDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}
