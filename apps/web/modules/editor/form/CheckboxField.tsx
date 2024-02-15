import { ConnectorProperty } from '@linkerry/connectors-framework'
import { Checkbox, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@linkerry/ui-components/client'
import { useFormContext } from 'react-hook-form'
import { useDynamicField } from './useFieldCustomValidation'

export const CheckboxField = ({ property }: { property: ConnectorProperty }) => {
	const { control } = useFormContext()

	const { rules } = useDynamicField({
		property,
	})

	return (
		<FormField
			control={control}
			name={property.name}
			rules={rules}
			render={({ field }) => (
				<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pl-1">
					<FormControl>
						<Checkbox checked={field.value} onCheckedChange={field.onChange} />
					</FormControl>
					<div className="space-y-1 leading-none">
						<FormLabel className="cursor-pointer">{property.displayName}</FormLabel>
						<FormDescription>{property.description}</FormDescription>
					</div>
				</FormItem>
			)}
		/>
	)
}
