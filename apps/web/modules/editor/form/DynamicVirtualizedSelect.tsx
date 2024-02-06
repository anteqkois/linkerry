import { DynamicDropdownProperty, DynamicDropdownState, PropertyType } from '@linkerry/connectors-framework'
import { useDebouncedCallback } from '@react-hookz/web'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { VirtualizedSelect } from './VirtualizedSelect'

export interface DynamicVirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: DynamicDropdownProperty
}

export const DynamicVirtualizedSelect = ({ property }: DynamicVirtualizedSelectProps) => {
	// const { getConnectorOptions } = useEditor()
	const { setValue, control, getValues, watch } = useFormContext()

	// console.log(property.refreshers)
	// const watcher = watch([property.refreshers])

	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return
			if (!property.refreshers.includes(name)) return
			console.log(values[name])
			// console.log(await getConnectorOptions());
			// console.log({
			// 	values,
			// 	name,
			// })
			// const newData: Record<string, any> = {}

			// for (const [key, value] of Object.entries(values)) {
			// 	if (key === 'triggerName' || key.includes('__temp__')) continue
			// 	if (editedTrigger.settings.input[key] == value) continue
			// 	newData[key] = value
			// }

			// await patchEditedTriggerConnector({
			// 	settings: {
			// 		input: newData,
			// 	},
			// })
		},
		[],
		1000,
	)

	useEffect(() => {
		const subscription = watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [])

	const [options, setOptions] = useState<DynamicDropdownState<any>>({
		options: [
			{
				label: '',
				value: '',
			},
		],
		disabled: false,
		placeholder: 'Placeholder',
	})

	return (
		<VirtualizedSelect
			property={{
				...property,
				type: PropertyType.STATIC_DROPDOWN,
				options,
			}}
		/>
	)

	// // setup temp field which holds String value based on started value from database
	// useEffect(() => {
	// 	const startedValueString = JSON.stringify(getValues(property.name) || '')
	// 	if (!startedValueString) return
	// 	const selectedOption = property.options.options.find((option) => JSON.stringify(option.value) === startedValueString)
	// 	if (selectedOption) setValue(`__temp__${property.name}`, selectedOption.label)
	// }, [])

	// const onChangeValue = (newLabel: string) => {
	// 	const value = property.options.options.find((option) => option.label === newLabel)
	// 	setValue(property.name, value?.value)
	// }

	// return (
	// 	<FormField
	// 		control={control}
	// 		name={`__temp__${property.name}`}
	// 		render={({ field }) => (
	// 			<FormItem>
	// 				<FormLabel>{property.displayName}</FormLabel>
	// 				<FormControl>
	// 					<Select
	// 						onValueChange={(newValue) => {
	// 							field.onChange(newValue)
	// 							onChangeValue(newValue)
	// 						}}
	// 					>
	// 						<SelectTrigger>
	// 							<SelectValue>{field.value}</SelectValue>
	// 						</SelectTrigger>
	// 						<SelectContent position="popper" className="max-h-96 overflow-scroll">
	// 							<VList style={{ height: 500 }}>
	// 								{property.options.options.map((option) => (
	// 									<SelectItem value={option.label} key={option.value}>
	// 										<span className="flex gap-2 items-center">
	// 											<p>{option.label}</p>
	// 										</span>
	// 									</SelectItem>
	// 								))}
	// 							</VList>
	// 						</SelectContent>
	// 					</Select>
	// 				</FormControl>
	// 				<FormMessage />
	// 			</FormItem>
	// 		)}
	// 	/>
	// )
}
