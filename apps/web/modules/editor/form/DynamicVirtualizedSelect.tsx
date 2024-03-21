import { DropdownOption, DynamicDropdownProperty, DynamicDropdownState, PropertyType } from '@linkerry/connectors-framework'
import { assertNotNullOrUndefined, isCustomHttpExceptionAxios, isEmpty } from '@linkerry/shared'
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
	name: string
}

export const DynamicVirtualizedSelect = ({ property, name }: DynamicVirtualizedSelectProps) => {
	const { toast } = useToast()
	const { getConnectorOptions, editedConnectorMetadata, editedAction } = useEditor()
	const { getValues, watch, setError, getFieldState } = useFormContext()
	const [options, setOptions] = useState<DynamicDropdownState<any>>(initOptions)
	const [initValue, setInitValue] = useState<DropdownOption<any>>({
		label: '',
		value: '',
	})

	const refreshOptions = async ({ values }: { values: Record<string, any> }) => {
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
				propertyName: name,
				input,
			})

			if (!response.options.length) {
				setOptions({
					options: response.options,
					disabled: true,
					placeholder: 'Options not found',
				})
				return { options: [], currentValue: undefined }
			}

			setOptions({
				options: response.options,
				disabled: response.disabled,
				placeholder: response.placeholder,
			})

			return { options: response.options, currentValue: values[name] }
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
			setError(`__temp__${name}`, {
				message: 'Can not retive options',
			})
			setOptions((options) => ({
				...options,
				placeholder: undefined,
			}))
			return { options: [], currentValue: undefined }
		}
	}

	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return
			if (!property.refreshers.includes(name)) return
			await refreshOptions({ values })
		},
		[],
		700,
	)

	useEffect(() => {
		if (isEmpty(editedAction?.settings.actionName)) return
		/* to prevent triggering options endpoint when selected edited action changed, not all veriables changed at once */
		if (editedConnectorMetadata?.name !== editedAction?.settings.connectorName) return

		/* check if refreshers are filled, if filled, fetch options */
		const values = getValues()
		const missingRefresherNames: string[] = []

		const allValidRefreshers = property.refreshers
			.map((refresher) => ({ ...getFieldState(refresher), value: values[refresher], refresher }))
			.filter((data) => {
				const isValid = !!(!data.error && !data.invalid && !isEmpty(data.value))
				if (!isValid) missingRefresherNames.push(data.refresher)
				return isValid
			})

		if (allValidRefreshers.length !== property.refreshers.length) {
			assertNotNullOrUndefined(editedConnectorMetadata, 'editedConnectorMetadata')
			assertNotNullOrUndefined(editedAction, 'editedAction')

			const selectedActionProps = Object.values(editedConnectorMetadata.actions).find(
				(action) => action.name === editedAction.settings.actionName,
			)?.props
			if (!selectedActionProps) return

			const missingRefreshers = property.refreshers.filter((refresherName) => selectedActionProps[refresherName].displayName)

			/* Move to end of callstack */
			setTimeout(() => {
				setError(`__temp__${name}`, {
					message: `First fill options: ${missingRefreshers}`,
				})
			}, 0)
		}

		if (allValidRefreshers.length === property.refreshers.length) {
			refreshOptions({ values: getValues() })
				.then(({ currentValue, options }) => {
					/* check if current value includes options */
					if (isEmpty(options)) return
					const selectedOption = options.find((option) => JSON.stringify(option.value) === JSON.stringify(currentValue))
					if (!selectedOption) return

					setInitValue(selectedOption)
					setOptions((options) => ({
						...options,
						disabled: false,
						placeholder: undefined,
					}))
				})
				.catch((error) => console.log(error))
		}

		/* triggered at  VirtualizedSelect */
		// trigger(name)

		const subscription = watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [])

	return (
		<VirtualizedSelect
			property={{
				...property,
				type: PropertyType.STATIC_DROPDOWN,
				options,
			}}
			name={name}
			initData={initValue}
		/>
	)
}
