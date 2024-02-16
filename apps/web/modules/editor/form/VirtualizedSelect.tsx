import { DropdownOption, StaticDropdownProperty } from '@linkerry/connectors-framework'
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
} from '@linkerry/ui-components/client'
import { HTMLAttributes, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { VList } from 'virtua'
import { useDynamicField } from './useFieldCustomValidation'

export interface VirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: StaticDropdownProperty
	initData?: DropdownOption<any>
}

export const VirtualizedSelect = ({ property, initData }: VirtualizedSelectProps) => {
	const { setValue, control, getValues, trigger } = useFormContext()

	const { rules } = useDynamicField({
		property,
	})

	// setup temp field which holds String value based on started value from database
	useEffect(() => {
		const startedValueString = JSON.stringify(getValues(property.name) || '')
		if (!startedValueString) return
		const selectedOption = property.options.options.find((option) => JSON.stringify(option.value) === startedValueString)
		if (selectedOption) setValue(`__temp__${property.name}`, selectedOption.label)
	}, [])

	useEffect(() => {
		if (!initData?.label) return

		setValue(property.name, initData.value)
		setValue(`__temp__${property.name}`, initData.label)
		trigger()
	}, [initData])

	const onChangeValue = (newLabel: string) => {
		const value = property.options.options.find((option) => option.label === newLabel)
		setValue(property.name, value?.value)
	}

	return (
		<FormField
			control={control}
			name={`__temp__${property.name}`}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{property.displayName}</FormLabel>
					<FormControl>
						<Select
							disabled={property.options.disabled}
							onValueChange={async (newValue) => {
								onChangeValue(newValue)
								/* add to end of callstack, can not witjout it becouse it brokes rendering  */
								setTimeout(() => {
									field.onChange(newValue)
								}, 0)
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
