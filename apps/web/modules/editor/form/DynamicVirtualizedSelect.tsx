import { DynamicDropdownProperty, DynamicDropdownState, PropertyType } from '@linkerry/connectors-framework'
import { isCustomHttpExceptionAxios } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { useDebouncedCallback } from '@react-hookz/web'
import { HTMLAttributes, useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { retriveStepInputFromObject } from '../steps/retriveStepInputFromObject'
import { useEditor } from '../useEditor'
import { VirtualizedSelect } from './VirtualizedSelect'

export interface DynamicVirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: DynamicDropdownProperty
}

export const DynamicVirtualizedSelect = ({ property }: DynamicVirtualizedSelectProps) => {
	const { toast } = useToast()
	const { getConnectorOptions } = useEditor()
	const { setValue, control, getValues, watch, setError } = useFormContext()
	const [options, setOptions] = useState<DynamicDropdownState<any>>({
		options: [
			{
				label: '',
				value: '',
			},
		],
		disabled: true,
		placeholder: 'Placeholder',
	})

	// console.log(property.refreshers)
	// const watcher = watch([property.refreshers])

	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return
			if (!property.refreshers.includes(name)) return
			const input = retriveStepInputFromObject({}, values, {
				onlyChanged: false,
			})
			console.log(input)

			try {
				const response = await getConnectorOptions({
					propertyName: property.name,
					input,
				})

				console.log(response)
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
				setError(name, {
					message: 'Can not retive options',
				})
			}
		},
		[],
		700,
	)

	useEffect(() => {
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
