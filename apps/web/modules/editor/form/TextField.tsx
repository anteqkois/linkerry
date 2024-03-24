import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDynamicField } from './useFieldCustomValidation'

interface TextFieldProps {
	property: ConnectorProperty
	name: string
}

export const TextField = ({ property, name }: TextFieldProps) => {
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
					<FormLabel>{property.displayName}</FormLabel>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
