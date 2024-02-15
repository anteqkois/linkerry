import { ConnectorProperty } from '@linkerry/connectors-framework'
import { useMemo } from 'react'
import { RegisterOptions } from 'react-hook-form'

// TODO move all duplicated logic to this hook
export const useDynamicField = ({ property }: { property: ConnectorProperty }) => {
	const validate = useMemo(() => {
		const output: RegisterOptions['validate'] = {}
		for (const validator of property.validators?.concat(...(property.defaultValidators ?? [])) ?? []) {
			if (!validator.validatorName) continue
			// @ts-ignore
			output[validator.validatorName] = (value) => Validators[validator.validatorName](...(validator.args ?? [])).fn(property, value, value)
		}
		return output
	}, [property.validators, property.defaultValidators])

	const rules = useMemo<Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>>(() => {
		return {
			required: { value: property.required, message: 'Required field' },
			validate,
		}
	}, [property.required, validate])

	return { validate, rules }
}
