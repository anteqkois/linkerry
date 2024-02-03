import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input } from '@linkerry/ui-components/client'
import { useEffect, useMemo } from 'react'
import { RegisterOptions, useFormContext } from 'react-hook-form'

export const TextField = ({ property }: {  property: ConnectorProperty }) => {
	const { control, trigger } = useFormContext()

	useEffect(() => {
		trigger()
	}, [])

	const validate = useMemo(() => {
		const output: RegisterOptions['validate'] = {}
		for (const validator of property.validators?.concat(...(property.defaultValidators ?? [])) ?? []) {
			if (!validator.validatorName) continue
			// @ts-ignore
			output[validator.validatorName] = (value) => Validators[validator.validatorName](...(validator.args ?? [])).fn(property, value, value)
		}
		return output
	}, [property.validators, property.defaultValidators])

	return (
		<FormField
			control={control}
			name={property.name}
			rules={{
				required: { value: property.required, message: 'Required field' },
				validate,
			}}
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
