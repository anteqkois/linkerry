import { ActionBase } from '@linkerry/connectors-framework'
import { ActionType, ConnectorGroup, assertNotNullOrUndefined } from '@linkerry/shared'
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
import { connectorsMetadataQueryConfig } from '../../connectors-metadata/api/query-configs'
import { DynamicField } from '../form/DynamicField'
import { useEditor } from '../useEditor'
import { ActionTest } from './ActionTest'

export const ActionConnectorPanel = () => {
	const { editedAction, patchEditedAction, updateEditedAction, nodes } = useEditor()
	if (!editedAction || editedAction?.type !== ActionType.CONNECTOR) throw new Error('Missing editedAction')
	const [testDataPanelHeight, setTestDataPanelHeight] = useState(30)

	const {
		data: connectorMetadata,
		isFetching,
		error,
	} = useClientQuery(
		connectorsMetadataQueryConfig.getOne({
			connectorName: editedAction.settings.connectorName,
			connectorVersion: editedAction.settings.connectorVersion,
		}),
	)

	const actionForm = useForm<{ __temp__action: ActionBase; actionName: ActionBase['name'] } & Record<string, any>>({
		mode: 'all',
	})
	const actionWatcher = actionForm.watch('__temp__action')

	// setup form fields on start based on editedAction input values (db), also set temp values (which shouldn't be saved in db )
	useEffect(() => {
		if (isFetching || editedAction.type !== ActionType.CONNECTOR || editedAction.settings.actionName === '') return
		assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata')

		const selectedAction = Object.values(connectorMetadata.actions).find((action) => action.name === editedAction.settings.actionName)
		if (!selectedAction) return

		actionForm.setValue('__temp__action', selectedAction)
		setTimeout(() => actionForm.setValue('actionName', selectedAction.name), 0) // add to the end of callstack

		const input = editedAction.settings.input
		if (selectedAction.props)
			Object.entries(selectedAction.props).map(([key, value]) => {
				if (input[key] !== undefined) actionForm.setValue(key, input[key])
				else if (typeof value.defaultValue !== 'undefined') actionForm.setValue(key, value.defaultValue)
			})
	}, [isFetching])

	// synchronize with global state and database, merge only new values
	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return
			if (name === 'actionName' || name.includes('__temp__')) return
			const newData: Record<string, any> = {}

			for (const [key, value] of Object.entries(values)) {
				if (key === 'actionName' || key.includes('__temp__')) continue
				if (editedAction.settings.input[key] == value) continue
				newData[key] = value
			}

			await patchEditedAction({
				settings: {
					input: newData,
				},
			})
		},
		[],
		1500,
	)

	useEffect(() => {
		const subscription = actionForm.watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [])

	if (isFetching) return <Spinner />
	if (error) return <ErrorInfo errorObject={error} />
	if (!connectorMetadata) return <ErrorInfo message="Can not find connector details" />

	// build dynamic form based on selected action schema -> props from action metadata
	const onChangeTrigger = async (actionName: string) => {
		const selectedAction = Object.values(connectorMetadata.actions).find((action) => action.name === actionName)
		if (!selectedAction) return
		actionForm.setValue('__temp__action', selectedAction)

		const input: Record<string, any> = {}
		if (selectedAction.props)
			Object.entries(selectedAction.props).map(([key, value]) => {
				if (typeof value.defaultValue !== 'undefined') actionForm.setValue(key, value.defaultValue)
				input[key] = value.defaultValue
			})

		await updateEditedAction({
			name: editedAction.name,
			valid: false,
			displayName: selectedAction.displayName,
			type: ActionType.CONNECTOR,
			settings: {
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				actionName: selectedAction.name,
				connectorType: connectorMetadata.connectorType,
				input,
				inputUiInfo: {},
			},
			nextActionName: '',
		})
	}

	return (
		<ResizablePanelGroup direction="vertical" className="max-h-screen">
			{JSON.stringify(nodes.map(node => node.position))}
			<ResizablePanel defaultSize={60} className="px-1">
				<div className="flex items-center justify-center gap-2">
					<Image width={36} height={36} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
					<div>
						<H5>{connectorMetadata.displayName}</H5>
					</div>
				</div>
				<Form {...actionForm}>
					<form className="space-y-5 mt-6" onSubmit={(e) => e.preventDefault()}>
						<FormField
							control={actionForm.control}
							name="actionName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Action</FormLabel>
									<FormControl>
										<Select
											value={field.value}
											onValueChange={(v) => {
												field.onChange(v)
												onChangeTrigger(v)
											}}
										>
											<SelectTrigger>
												<SelectValue placeholder="Select action" />
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.values(connectorMetadata.actions).map((action) => {
													return (
														<SelectItem value={action.name} key={action.name}>
															<span className="flex gap-2 items-center">
																<p>{action.displayName}</p>
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
						{actionWatcher?.props && Object.values(actionWatcher.props).map((prop) => <DynamicField property={prop} key={prop.name} />)}
					</form>
				</Form>
			</ResizablePanel>
			<ResizableHandle withHandle />
			{connectorMetadata.group !== ConnectorGroup.Core && (
				<ResizablePanel defaultSize={30} maxSize={80} onResize={(size) => setTestDataPanelHeight(size)}>
					<ActionTest panelSize={testDataPanelHeight} />
				</ResizablePanel>
			)}
		</ResizablePanelGroup>
	)
}
