import { DynamicDropdownProperty, DynamicDropdownState, PropertyType } from '@linkerry/connectors-framework'
import { isCustomHttpExceptionAxios, isEmpty } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { useDebouncedCallback } from '@react-hookz/web'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { retriveStepInputFromObject } from '../steps/retriveStepInputFromObject'
import { useEditor } from '../useEditor'
import { VirtualizedSelect } from './VirtualizedSelect'

const initOptions = {
	options: [
		{
			label: '',
			value: '',
		},
	],
	disabled: true,
	placeholder: undefined,
}

export interface DynamicVirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: DynamicDropdownProperty
}

export const DynamicVirtualizedSelect = ({ property }: DynamicVirtualizedSelectProps) => {
	const { toast } = useToast()
	const { getConnectorOptions } = useEditor()
	const { setValue, control, getValues, watch, setError, getFieldState } = useFormContext()
	const [options, setOptions] = useState<DynamicDropdownState<any>>(initOptions)

	// console.log(property.refreshers)
	// const watcher = watch([property.refreshers])

	const refreshOptions = async ({ values, fieldName }: { values: Record<string, any>; fieldName: string }) => {
		setOptions((options) => ({
			...options,
			disabled: true,
			placeholder: 'Loading...',
		}))

		const input = retriveStepInputFromObject({}, values, {
			onlyChanged: false,
		})

		try {
			const response = await getConnectorOptions({
				propertyName: property.name,
				input,
			})

			setOptions({
				options: response.options,
				disabled: response.disabled,
				placeholder: response.placeholder,
			})

			if (isEmpty(values[property.name])) return
			/* check if current value includes options */

			const selectedOption = options.options.find((option) => option.value === values[property.name])
			setValue(property.name, selectedOption?.value)
		} catch (error) {
			if (isCustomHttpExceptionAxios(error))
				toast({
					title: `Something got wrong, try later again. Error message: ${error.response.data.message}`,
					variant: 'destructive',
				})
			else {
				toast({
					title: `Something got wrong, inform our IT tem and try again later`,
					variant: 'destructive',
				})
				console.log(error)
			}
			setError(fieldName, {
				message: 'Can not retive options',
			})
			setOptions((options) => ({
				...options,
				placeholder: undefined,
			}))
		}
	}

	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return
			if (!property.refreshers.includes(name)) return
			await refreshOptions({ values, fieldName: name })
		},
		[],
		700,
	)

	useEffect(() => {
		const subscription = watch(handleWatcher)

		/* check if refreshers are filled, if filled, fetch options */
		const someRefresherValid = property.refreshers
			.map((refresher) => ({ ...getFieldState(refresher), refresher }))
			.filter((data) => !data.error && !data.invalid)

		if (someRefresherValid.length)
			refreshOptions({ values: getValues(), fieldName: someRefresherValid[0].refresher }).catch((error) => console.log(error))

		return () => subscription.unsubscribe()
	}, [])

	return (
		<VirtualizedSelect
			property={{
				...property,
				type: PropertyType.STATIC_DROPDOWN,
				options,
			}}
		/>
	)
}
