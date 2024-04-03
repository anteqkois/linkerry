import { ConnectorProperty, ShortTextProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyDescription } from './PropertyDescription'
import { PropertyLabel } from './PropertyLabel'
import { useDynamicField } from './useFieldCustomValidation'

interface TextFieldProps {
	property: ShortTextProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const TextField = ({ property, name, refreshedProperties }: TextFieldProps) => {
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
			defaultValue={''}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<PropertyLabel property={property} refreshedProperties={refreshedProperties} />
					<FormControl>
						<Input {...field} />
					</FormControl>
					<PropertyDescription>{property.description}</PropertyDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
