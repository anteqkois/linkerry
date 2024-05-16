import { ConnectorProperty, NumberProperty } from '@linkerry/connectors-framework'
import { hasVariableToken } from '@linkerry/shared'
import { FormControl, FormField, FormItem, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { PropertyDescription } from '../PropertyDescription'
import { PropertyLabel } from '../PropertyLabel'
import { useDynamicField } from '../useFieldCustomValidation'
import { DynamicValueField } from './DynamicValueField'

interface NumberFieldProps {
	property: NumberProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const NumberField = ({ property, name, refreshedProperties }: NumberFieldProps) => {
	const { control, trigger, getValues } = useFormContext()
	const { rules, useDynamicValue, setUseDynamicValue } = useDynamicField({
		property,
	})

	useEffect(() => {
		trigger(name)

		const value = getValues(name)
    if (typeof value !== 'string') return
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
						<Input {...field} type="number" onChange={(event) => field.onChange(+event.target.value)} />
					</FormControl>
					<PropertyDescription>{property.description}</PropertyDescription>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
