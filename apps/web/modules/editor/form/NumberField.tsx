import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDynamicField } from './useFieldCustomValidation'

export const NumberField = ({ property }: { property: ConnectorProperty }) => {
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
			name={property.name}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{property.displayName}</FormLabel>
					<FormControl>
						<Input {...field} type="number" />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
