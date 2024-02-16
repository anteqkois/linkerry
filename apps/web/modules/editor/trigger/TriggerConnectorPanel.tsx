import { TriggerBase, TriggerStrategy } from '@linkerry/connectors-framework'
import { ConnectorGroup, TriggerType, assertNotNullOrUndefined, isEmpty } from '@linkerry/shared'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@linkerry/ui-components/client'
import { H5 } from '@linkerry/ui-components/server'
import { useDebouncedCallback } from '@react-hookz/web'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { DynamicField } from '../form/DynamicField'
import { ConnectorVersion } from '../steps/ConnectorVersion'
import { retriveStepInputFromObject } from '../steps/retriveStepInputFromObject'
import { useEditor } from '../useEditor'
import { TriggerEventsTest } from './TriggerEventsTest'

export const TriggerConnectorPanel = () => {
	const { editedTrigger, patchEditedTriggerConnector, updateEditedTrigger, setEditedConnectorMetadata } = useEditor()
	if (!editedTrigger || editedTrigger?.type !== TriggerType.CONNECTOR) throw new Error('Missing editedTrigger')
	const [testDataPanelHeight, setTestDataPanelHeight] = useState(30)

	const {
		data: connectorMetadata,
		isFetched,
		isLoading,
		error,
	} = useClientQuery(
		connectorsMetadataQueryConfig.getOne({
			connectorName: editedTrigger.settings.connectorName,
			connectorVersion: editedTrigger.settings.connectorVersion,
		}),
	)

	const triggerForm = useForm<{ __temp__trigger: TriggerBase; triggerName: TriggerBase['name'] } & Record<string, any>>({
		mode: 'all',
	})
	const triggerWatcher = triggerForm.watch('__temp__trigger')

	// setup form fields on start based on editedTrigger input values (db), also set temp values (which shouldn't be saved in db )
	useEffect(() => {
		if (!isFetched) return
		assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata', {
			connectorName: editedTrigger.settings.connectorName,
			connectorVersion: editedTrigger.settings.connectorVersion,
		})
		setEditedConnectorMetadata(connectorMetadata)

		if (editedTrigger.type !== TriggerType.CONNECTOR || editedTrigger.settings.triggerName === '') return
		const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === editedTrigger.settings.triggerName)
		if (!selectedTrigger) return
		triggerForm.setValue('__temp__trigger', selectedTrigger)
		setTimeout(() => triggerForm.setValue('triggerName', selectedTrigger.name), 0) // add to the end of callstack

		const input = editedTrigger.settings.input
		if (selectedTrigger.props)
			Object.entries(selectedTrigger.props).map(([key, value]) => {
				if (input[key] !== undefined) triggerForm.setValue(key, input[key])
				else if (typeof value.defaultValue !== 'undefined') triggerForm.setValue(key, value.defaultValue)
			})
	}, [isFetched])

	// synchronize with global state and database, merge only new values
	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return

			const newData = retriveStepInputFromObject(editedTrigger.settings.input, values, {
				onlyChanged: true,
			})

			if (newData)
				await patchEditedTriggerConnector({
					settings: {
						input: newData,
					},
				})
		},
		[],
		1000,
	)

	useEffect(() => {
		const subscription = triggerForm.watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [])

	if (isLoading) return <Spinner />
	if (error) return <ErrorInfo errorObject={error} />
	if (!connectorMetadata) return <ErrorInfo message="Can not find connector details" />

	// build dynamic form based on selected trigger schema -> props from trigger metadata
	const onChangeTrigger = async (triggerName: string) => {
		const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === triggerName)
		if (!selectedTrigger) return
		triggerForm.setValue('__temp__trigger', selectedTrigger)

		const input: Record<string, any> = {}
		if (selectedTrigger.props)
			Object.entries(selectedTrigger.props).map(([key, value]) => {
				if (typeof value.defaultValue !== 'undefined') triggerForm.setValue(key, value.defaultValue)
				input[key] = value.defaultValue
			})

		await updateEditedTrigger({
			name: editedTrigger.name,
			valid: false,
			displayName: selectedTrigger.displayName,
			type: TriggerType.CONNECTOR,
			settings: {
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				triggerName: selectedTrigger.name,
				input,
				inputUiInfo: {},
			},
			nextActionName: '',
		})

		triggerForm.trigger()
	}

	return (
		<ResizablePanelGroup direction="vertical" className="max-h-screen">
			<ResizablePanel defaultSize={60} className="px-1">
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
					<form className="space-y-5 mt-6" onSubmit={(e) => e.preventDefault()}>
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
												<SelectValue placeholder="Select flow trigger" />
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
						{triggerWatcher?.props && Object.values(triggerWatcher.props).map((prop) => <DynamicField property={prop} key={prop.name} />)}
					</form>
				</Form>
				<ConnectorVersion connectorMetadata={connectorMetadata} className='mt-4'/>
			</ResizablePanel>
			<ResizableHandle withHandle />
			{connectorMetadata.group !== ConnectorGroup.Core && triggerWatcher?.type === TriggerStrategy.POLLING && (
				<ResizablePanel
					defaultSize={editedTrigger.settings.inputUiInfo.currentSelectedData ? 50 : 30}
					maxSize={80}
					onResize={(size) => setTestDataPanelHeight(size)}
				>
					<TriggerEventsTest
						panelSize={testDataPanelHeight}
						disabled={isEmpty(triggerWatcher?.name) || Object.keys(triggerForm.formState.errors).length !== 0}
						disabledMessage={isEmpty(triggerWatcher?.props) ? 'Choose Trigger' : 'First fill all required Trigger fields'}
					/>
				</ResizablePanel>
			)}
		</ResizablePanelGroup>
	)
}
