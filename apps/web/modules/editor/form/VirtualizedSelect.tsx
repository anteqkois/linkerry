import { ConnectorProperty, DropdownOption, PropertyType, StaticDropdownProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { VList } from 'virtua'
import { TextField } from './TextFieldDynamicValue'
import { useDynamicField } from './useFieldCustomValidation'

export interface VirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: StaticDropdownProperty
	name: string
	refreshedProperties: ConnectorProperty[]
	type?: PropertyType.STATIC_DROPDOWN | PropertyType.DYNAMIC_DROPDOWN
	initData?: DropdownOption<any>
}

export const VirtualizedSelect = ({ property, initData, name, type = PropertyType.STATIC_DROPDOWN }: VirtualizedSelectProps) => {
	const { setValue, control, getValues, trigger } = useFormContext()
	const [useDynamicValue, setUseDynamicValue] = useState(false)
	const { rules } = useDynamicField({
		property,
	})

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

	const onChangeValue = (newLabel: string) => {
		const value = property.options.options.find((option) => option.label === newLabel)
		setValue(name, value?.value)
	}

	return useDynamicValue ? (
		<TextField
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
					<div className="flex justify-between">
						<FormLabel>{property.displayName}</FormLabel>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger onClick={() => setUseDynamicValue(true)} className='text-primary-foreground/40 hover:text-primary-foreground'>
									<Icons.Power size={'sm'} className="mb-1 mr-2" />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start">
									<p>Switch to use dynamic value</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<FormControl>
						<Select
							disabled={property.options.disabled}
							onValueChange={async (newValue) => {
								onChangeValue(newValue)
								field.onChange(newValue)
							}}
						>
							<SelectTrigger>
								<SelectValue placeholder={property.options.placeholder} aria-label={field.value}>
									{field.value}
									{/* {property.options.options.find((option) => option.label === field.value)?.label} */}
								</SelectValue>
							</SelectTrigger>
							<SelectContent position="popper" className="max-h-96 overflow-scroll">
								<VList style={{ height: 500 }}>
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
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
