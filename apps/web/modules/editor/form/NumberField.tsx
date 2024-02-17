import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDynamicField } from './useFieldCustomValidation'

interface NumberFieldProps {
	property: ConnectorProperty
	name: string
}

export const NumberField = ({ property, name }: NumberFieldProps) => {
	const { control, trigger } = useFormContext()

	useEffect(() => {
		trigger()
	}, [])

	const { rules } = useDynamicField({
		property,
	})

	return (
		<FormField
			control={control}
			name={name}
			defaultValue={''}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{property.displayName}</FormLabel>
					<FormControl>
						<Input {...field} type="number" onChange={(event) => field.onChange(+event.target.value)} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
