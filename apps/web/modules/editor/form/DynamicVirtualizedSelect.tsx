import { ConnectorProperty, DropdownOption, DynamicDropdownProperty, DynamicDropdownState, PropertyType } from '@linkerry/connectors-framework'
import { hasVariableToken, isCustomHttpExceptionAxios, isEmpty, isNil, isStepBaseSettings } from '@linkerry/shared'
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
	refreshedProperties: ConnectorProperty[]
}

export const DynamicVirtualizedSelect = ({ property, name, refreshedProperties }: DynamicVirtualizedSelectProps) => {
	const { toast } = useToast()
	const { getConnectorOptions, editedConnectorMetadata, editedAction, editedTrigger } = useEditor()
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

			// if (response.disabled) {
			// 	setOptions({
			// 		options: response.options,
			// 		disabled: true,
			// 		placeholder: 'Options not found',
			// 	})
			// 	return { options: [], currentValue: undefined }
			// }

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
			if (!property.refreshers.includes(name) && name !== 'auth') return
			await refreshOptions({ values })
		},
		[],
		700,
	)

	useEffect(() => {
		const isEditedTrigger = isNil(editedAction)
		const editedStep = isEditedTrigger ? editedTrigger : editedAction
		if (isNil(editedStep)) return console.log(`editedStep empty`)
		// if (isNil(editedStep.settings)) return console.log(`editedStep.settings empty`)

		/* to prevent triggering options endpoint when selected edited action changed, not all veriables changed at once */
		const editedStepName: string | undefined = isEditedTrigger ? editedStep.settings.triggerName : editedStep.settings.actionName
		if (isNil(editedStepName)) return console.log(`stepName empty`)
		if (!isStepBaseSettings(editedStep.settings)) return console.log(`editedStep.settings ins't baseSettings`)

		if (editedStep.settings.connectorName !== editedConnectorMetadata?.name)
			return console.log(`connectors different; editedStep.name=${editedStep.name}, editedConnectorMetadata.name=${editedConnectorMetadata?.name}`)

		/* Check id user used dynamic value */
		const currentValue = editedStep?.settings.input[name]
		if (currentValue && hasVariableToken(currentValue)) {
			// // TODO (better in dynamic text compoienent amd set as required when back to base field)
			// /* set all refreshers as not required */
			// property.refreshers.forEach(refresher =>{
			// 	// refresher
			// })
			return
		}

		/* check if refreshers are filled, if filled, fetch options */

		const selectedStepProps = Object.values(isEditedTrigger ? editedConnectorMetadata.triggers : editedConnectorMetadata.actions).find(
			(step) => step.name === editedStepName,
		)?.props
		if (isNil(selectedStepProps)) return console.log(`selectedStepProps empty`)
		const stepProperties = Object.keys(selectedStepProps)
		/* In property.refreshers can be propeerties which aren't showing to user, and then missingRefreshers will be empty */
		property.refreshers = property.refreshers.filter((refresher) => stepProperties.includes(refresher))

		const values = getValues()
		const missingRefresherNames: string[] = []
		const allValidRefresherNames = property.refreshers
			.map((refresher) => ({ ...getFieldState(refresher), value: values[refresher], refresher }))
			.filter((data) => {
				const isValid = !!(!data.error && !data.invalid && !isEmpty(data.value))
				if (!isValid) missingRefresherNames.push(data.refresher)
				return isValid
			})
			.map((data) => data.refresher)

		if (missingRefresherNames.length) {
			const missingPropDisplayNames = Object.entries(selectedStepProps)
				.filter(([name]) => missingRefresherNames.includes(name))
				.map(([name, value]) => value.displayName)

			/* Move to end of callstack */
			setTimeout(() => {
				if (missingRefresherNames.length)
					setError(`__temp__${name}`, {
						message: `First fill options: ${missingPropDisplayNames.join(', ')}`,
					})
			}, 0)
		}

		if (allValidRefresherNames.length === property.refreshers.length) {
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
		// TODO fix not refreshing options when dependent refresher was selected, check if it necessary to add in dependencies refresher inputs
	}, [])

	return (
		<VirtualizedSelect
			property={{
				...property,
				type: PropertyType.STATIC_DROPDOWN,
				options,
			}}
			refreshedProperties={refreshedProperties}
			type={PropertyType.DYNAMIC_DROPDOWN}
			name={name}
			initData={initValue}
		/>
	)
}
