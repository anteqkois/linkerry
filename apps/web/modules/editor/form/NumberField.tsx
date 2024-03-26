import { ConnectorProperty, NumberProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyLabel } from './PropertyLabel'
import { useDynamicField } from './useFieldCustomValidation'

interface NumberFieldProps {
	property: NumberProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const NumberField = ({ property, name, refreshedProperties }: NumberFieldProps) => {
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
						<Input {...field} type="number" onChange={(event) => field.onChange(+event.target.value)} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
