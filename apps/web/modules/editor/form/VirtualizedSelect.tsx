import { StaticDropdownProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@linkerry/ui-components/client'
import { HTMLAttributes, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { VList } from 'virtua'

export interface VirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: StaticDropdownProperty
}

export const VirtualizedSelect = ({ property }: VirtualizedSelectProps) => {
	const { setValue, control, getValues } = useFormContext()

	// setup temp field which holds String value based on started value from database
	useEffect(() => {
		const startedValueString = JSON.stringify(getValues(property.name) || '')
		if (!startedValueString) return
		const selectedOption = property.options.options.find((option) => JSON.stringify(option.value) === startedValueString)
		if (selectedOption) setValue(`__temp__${property.name}`, selectedOption.label)
	}, [])

	const onChangeValue = (newLabel: string) => {
		const value = property.options.options.find((option) => option.label === newLabel)
		setValue(property.name, value?.value)
	}

	return (
		<FormField
			control={control}
			name={`__temp__${property.name}`}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{property.displayName}</FormLabel>
					<FormControl>
						<Select
							onValueChange={(newValue) => {
								field.onChange(newValue)
								onChangeValue(newValue)
							}}
						>
							<SelectTrigger>
								<SelectValue>{field.value}</SelectValue>
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
