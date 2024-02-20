import { ConnectorProperty, Validators } from '@linkerry/connectors-framework'
import { useMemo } from 'react'
import { RegisterOptions } from 'react-hook-form'

export const useDynamicField = ({ property }: { property: ConnectorProperty }) => {
	const validate = useMemo(() => {
		const output: RegisterOptions['validate'] = {}
		for (const validator of property.validators?.concat(...(property.defaultValidators ?? [])) ?? []) {
			if (!validator.validatorName) continue
			output[validator.validatorName] = (value) => {
				// @ts-ignore
				const validatorEntry = Validators[validator.validatorName]
				if (typeof validatorEntry === 'function') return validatorEntry(...(validator.args ?? [])).fn(property, value, value)
				return validatorEntry.fn(property, value, value)
			}
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
