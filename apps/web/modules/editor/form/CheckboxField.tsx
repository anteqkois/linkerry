import { CheckboxProperty, ConnectorProperty } from '@linkerry/connectors-framework'
import { Checkbox, FormControl, FormDescription, FormField, FormItem } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyLabel } from './PropertyLabel'
import { useDynamicField } from './useFieldCustomValidation'

interface CheckboxFieldProps {
	property: CheckboxProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const CheckboxField = ({ property, name, refreshedProperties }: CheckboxFieldProps) => {
	const { control, trigger } = useFormContext()
	const { rules } = useDynamicField({
		property,
	})

	useEffect(() => {
		trigger(name)
	}, [])

	return (
		<FormField
			control={control}
			name={name}
			rules={{ ...rules, required: false }}
			render={({ field }) => (
				<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pl-1">
					<FormControl>
						<Checkbox checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
					<div className="space-y-1 leading-none">
						<PropertyLabel property={property} refreshedProperties={refreshedProperties} />
						<FormDescription>{property.description}</FormDescription>
					</div>
				</FormItem>
			)}
		/>
	)
}
