import { ConnectorProperty, ShortTextProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'
import { hasVariableToken, isNil } from '@linkerry/shared'

interface TextFieldProps {
	property: ShortTextProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const TextField = ({ property, name, refreshedProperties }: TextFieldProps) => {
	const { control, trigger, getValues } = useFormContext()
	const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField({
		property,
	})

	useEffect(() => {
		trigger(name)

		const value = getValues(name)
		if (isNil(value)) return
		else if (hasVariableToken(value)) {
			setUseDynamicValue(true)
		}
	}, [])

	return useDynamicValue ? (
		<DynamicValueField name={name} property={property} setUseDynamicValue={setUseDynamicValue} showDynamicValueButton={true} />
	) : (
		<FormField
			control={control}
			name={name}
			defaultValue={''}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<PropertyLabel property={property} refreshedProperties={refreshedProperties} setUseDynamicValue={setUseDynamicValue}/>
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
