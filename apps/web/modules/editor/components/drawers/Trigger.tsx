import { ConnectorProperty, PropertyType, StaticDropdownProperty, TriggerBase, Validators } from '@market-connector/connectors-framework'
import { CustomError, TriggerType } from '@market-connector/shared'
import {
	Checkbox,
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@market-connector/ui-components/client'
import { Button, H5 } from '@market-connector/ui-components/server'
import { useDebouncedCallback } from '@react-hookz/web'
import Image from 'next/image'
import { HTMLAttributes, useEffect, useMemo } from 'react'
import { RegisterOptions, UseFormReturn, useForm, useFormContext } from 'react-hook-form'
import { VList } from 'virtua'
import { useClientQuery } from '../../../../libs/react-query'
import { ErrorInfo } from '../../../../shared/components/ErrorInfo'
import { Spinner } from '../../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../../connectors-metadata/api/query-configs'
import { useEditor } from '../../useEditor'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

export interface VirtualizedSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	property: StaticDropdownProperty
}

export const VirtualizedSelect = ({ property }: VirtualizedSelectProps) => {
	const { setValue, control, getValues } = useFormContext()

	// setup temp field which holds String value based on started value from database
	useEffect(() => {
		const startedValueString = JSON.stringify(getValues(property.name) || '')
		if (!startedValueString) return
		const selectedOption = property.options.options.find((option) => JSON.stringify(option.value) === startedValueString)
		if (selectedOption) setValue(`__temp__${property.name}`, selectedOption.label)
	}, [])

	const onChangeValue = (newLabel: string) => {
		const value = property.options.options.find((option) => option.label === newLabel)
		setValue(property.name, value?.value)
	}

	return (
		<FormField
			control={control}
			name={`__temp__${property.name}`}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{property.displayName}</FormLabel>
					<FormControl>
						<Select
							onValueChange={(newValue) => {
								field.onChange(newValue)
								onChangeValue(newValue)
							}}
						>
							<SelectTrigger>
								<SelectValue>{field.value}</SelectValue>
							</SelectTrigger>
							<SelectContent position="popper" className="max-h-96 overflow-scroll">
								<VList style={{ height: 500 }}>
									{property.options.options.map((option) => (
										<SelectItem value={option.label} key={option.value}>
											<span className="flex gap-2 items-center">
												<p>{option.label}</p>
											</span>
										</SelectItem>
									))}
								</VList>
							</SelectContent>
						</Select>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

const DynamicField = ({ property }: { form: UseFormReturn<any, any>; property: ConnectorProperty }) => {
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

	switch (property.type) {
		case PropertyType.Text:
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
		case PropertyType.Checkbox:
			return (
				<FormField
					control={control}
					name={property.name}
					render={({ field }) => (
						<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pl-1">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<div className="space-y-1 leading-none">
								<FormLabel className="cursor-pointer">{property.displayName}</FormLabel>
								<FormDescription>{property.description}</FormDescription>
							</div>
						</FormItem>
					)}
				/>
			)
		case PropertyType.StaticDropdown:
			return <VirtualizedSelect property={property} />

		default:
			break
	}
}

const handleOnSubmit = (data: any) => {
	console.log(data)
}

export const TriggerDrawer = () => {
	const { editedTrigger, patchEditedTriggerConnector, updateEditedTrigger } = useEditor()
	if (!editedTrigger || editedTrigger?.type !== TriggerType.Connector) throw new Error('Missing editedTrigger')

	const {
		data: connectorMetadata,
		isFetching,
		error,
	} = useClientQuery(connectorsMetadataQueryConfig.getOne({ id: editedTrigger.settings.connectorId }))

	const triggerForm = useForm<{ __temp__trigger: TriggerBase; triggerName: TriggerBase['name'] } & Record<string, any>>({
		mode: 'all',
	})
	const triggerWatcher = triggerForm.watch('__temp__trigger')

	// setup form fields on start based on editedTrigger input values (db), also set temp values (which shouldn't be saved in db )
	useEffect(() => {
		if (isFetching || editedTrigger.type !== TriggerType.Connector || editedTrigger.settings.triggerName === '') return
		if (!connectorMetadata) throw new CustomError('Can not find connector metadata')

		const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === editedTrigger.settings.triggerName)
		if (!selectedTrigger) return

		triggerForm.setValue('__temp__trigger', selectedTrigger)
		// triggerForm.setValue('triggerName', selectedTrigger.name)
		setTimeout(() => triggerForm.setValue('triggerName', selectedTrigger.name), 0) // ad to the end of callstack

		const input = editedTrigger.settings.input
		Object.entries(selectedTrigger.props).map(([key, value]) => {
			if (input[key] !== undefined) triggerForm.setValue(key, input[key])
			else if (typeof value.defaultValue !== 'undefined') triggerForm.setValue(key, value.defaultValue)
		})
	}, [isFetching])

	// synchronize with global state and database, merge only new values
	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return
			if (name === 'triggerName' || name.includes('__temp__')) return
			const newData: Record<string, any> = {}

			for (const [key, value] of Object.entries(values)) {
				if (key === 'triggerName' || key.includes('__temp__')) continue
				if (editedTrigger.settings.input[key] == value) continue
				newData[key] = value
			}

			await patchEditedTriggerConnector({
				settings: {
					input: newData,
				},
			})
		},
		[],
		1500,
	)

	useEffect(() => {
		const subscription = triggerForm.watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [])

	if (isFetching) return <Spinner />
	if (error) return <ErrorInfo errorObject={error} />
	if (!connectorMetadata) return <ErrorInfo message="Can not find connector details" />

	// build dynamic form based on selected trigger schema -> props from trigger metadata
	const onChangeTrigger = (triggerName: string) => {
		const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === triggerName)
		if (!selectedTrigger) return
		triggerForm.setValue('__temp__trigger', selectedTrigger)

		const input: Record<string, any> = {}
		Object.entries(selectedTrigger.props).map(([key, value]) => {
			if (typeof value.defaultValue !== 'undefined') triggerForm.setValue(key, value.defaultValue)
			input[key] = value.defaultValue
		})

		updateEditedTrigger({
			name: editedTrigger.name,
			valid: false,
			displayName: selectedTrigger.displayName,
			type: TriggerType.Connector,
			settings: {
				connectorId: connectorMetadata._id,
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				triggerName: selectedTrigger.name,
				input,
				inputUiInfo: {},
			},
		})
	}

	return (
		<div>
			<div className="flex items-center justify-center gap-2">
				<Image width={36} height={36} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
				<div>
					<H5>{connectorMetadata.displayName}</H5>
				</div>
			</div>
			{/* <Button className="w-full mt-5" variant={'secondary'} onClick={() => resetTrigger(editedTrigger.id)}>
				Change trigger
			</Button> */}
			<Form {...triggerForm}>
				<form onSubmit={triggerForm.handleSubmit(handleOnSubmit)} className="space-y-5 mt-6">
					<FormField
						control={triggerForm.control}
						name="triggerName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Trigger</FormLabel>
								<FormControl>
									<Select
										value={field.value}
										onValueChange={(v) => {
											field.onChange(v)
											onChangeTrigger(v)
										}}
									>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent position="popper">
											{Object.values(connectorMetadata.triggers).map((trigger) => {
												return (
													<SelectItem value={trigger.name} key={trigger.name}>
														<span className="flex gap-2 items-center">
															<p>{trigger.displayName}</p>
														</span>
													</SelectItem>
												)
											})}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{triggerWatcher && Object.values(triggerWatcher.props).map((prop) => <DynamicField form={triggerForm} property={prop} key={prop.name} />)}
					<div className="flex justify-end">
						{/* <Button type="submit" loading={isLoading} className="w-full"> */}
						<Button type="submit" className="w-full">
							Test
						</Button>
					</div>
				</form>
			</Form>
		</div>
	)
}
