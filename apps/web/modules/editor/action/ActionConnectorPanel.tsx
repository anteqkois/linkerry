import { ActionBase } from '@linkerry/connectors-framework'
import { ActionType, ConnectorGroup, assertNotNullOrUndefined, isEmpty } from '@linkerry/shared'
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
import { ConnectionsSelect } from '../form/ConnectionsSelect'
import { DynamicField } from '../form/DynamicField'
import { ConnectorVersion } from '../steps/ConnectorVersion'
import { retriveStepInputFromObject } from '../steps/retriveStepInputFromObject'
import { useEditor } from '../useEditor'
import { ActionTest } from './ActionTest'

export const ActionConnectorPanel = () => {
	const { editedAction, patchEditedAction, updateEditedAction, setEditedConnectorMetadata } = useEditor()
	if (!editedAction || editedAction?.type !== ActionType.ACTION) throw new Error('Missing editedAction')
	const [testDataPanelHeight, setTestDataPanelHeight] = useState(30)

	const {
		data: connectorMetadata,
		isFetched,
		isLoading,
		error,
	} = useClientQuery(
		connectorsMetadataQueryConfig.getOne({
			connectorName: editedAction.settings.connectorName,
			connectorVersion: editedAction.settings.connectorVersion,
		}),
	)

	const actionForm = useForm<{ __temp__action: ActionBase | null; actionName: ActionBase['name'] | null } & Record<string, any>>({
		mode: 'all',
		defaultValues: {
			__temp__action: null,
			actionName: null,
		},
	})
	const actionWatcher = actionForm.watch('__temp__action')

	// setup form fields on start based on editedAction input values (db), also set temp values (which shouldn't be saved in db )
	useEffect(() => {
		if (!isFetched) return
		assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata', editedAction.settings)
		setEditedConnectorMetadata(connectorMetadata)

		if (editedAction.type !== ActionType.ACTION || editedAction.settings.actionName === '') {
			actionForm.reset({
				__temp__action: null,
				actionName: null,
			})
			return
		}

		const selectedAction = Object.values(connectorMetadata.actions).find((action) => action.name === editedAction.settings.actionName)
		assertNotNullOrUndefined(selectedAction, 'selectedAction')

		const initData: Record<string, any> = {}
		if (selectedAction.props)
			Object.entries(selectedAction.props).map(([key, value]) => {
				if (editedAction.settings.input[key] !== undefined) initData[key] = editedAction.settings.input[key]
				else if (typeof value.defaultValue !== 'undefined') initData[key] = value.defaultValue
			})

		if (selectedAction.requireAuth) {
			if (editedAction.settings.input.auth !== undefined) initData['auth'] = editedAction.settings.input['auth']
		}

		/* add to the end of callstack */
		setTimeout(() => {
			actionForm.reset({
				__temp__action: selectedAction,
				actionName: selectedAction.name,
				...initData,
			})
		}, 0)
	}, [isFetched, editedAction.settings.connectorName])

	// synchronize with global state and database, merge only new values
	const handleWatcher = useDebouncedCallback(
		async (values, { name }) => {
			if (!name) return

			const newData = retriveStepInputFromObject(editedAction.settings.input, values, {
				onlyChanged: true,
			})

			if (Object.keys(newData).length)
				await patchEditedAction({
					settings: {
						input: newData,
					},
				})
		},
		[editedAction.settings.input, editedAction],
		1000,
	)

	useEffect(() => {
		const subscription = actionForm.watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [editedAction.settings.connectorName])

	if (isLoading) return <Spinner />
	if (error) return <ErrorInfo errorObject={error} />
	if (!connectorMetadata) return <ErrorInfo message="Can not find connector details" />

	// build dynamic form based on selected action schema -> props from action metadata
	const onChangeAction = async (actionName: string) => {
		const selectedAction = Object.values(connectorMetadata.actions).find((action) => action.name === actionName)
		assertNotNullOrUndefined(selectedAction, 'selectedAction')

		const input: Record<string, any> = {}
		if (selectedAction.props)
			Object.entries(selectedAction.props).forEach(([key, value]) => {
				if (typeof value.defaultValue === 'undefined') return
				input[key] = value.defaultValue
			})

		actionForm.reset({
			__temp__action: selectedAction,
			actionName,
			...input,
		})

		await updateEditedAction({
			name: editedAction.name,
			valid: false,
			displayName: selectedAction.displayName,
			type: ActionType.ACTION,
			settings: {
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				actionName: selectedAction.name,
				input,
				inputUiInfo: {},
			},
			nextActionName: '',
		})
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
											value={field.value === null ? undefined : field.value}
											onValueChange={(v) => {
												field.onChange(v)
												onChangeAction(v)
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
						{actionWatcher?.requireAuth && connectorMetadata.auth ? (
							<ConnectionsSelect
								auth={connectorMetadata.auth}
								connector={{ name: connectorMetadata.name, displayName: connectorMetadata.displayName }}
							/>
						) : null}
						{actionWatcher?.props &&
							Object.entries(actionWatcher.props).map(([name, property]) => <DynamicField property={property} name={name} key={name} />)}
					</form>
				</Form>
				<ConnectorVersion connectorMetadata={connectorMetadata} className="mt-4" />
			</ResizablePanel>
			<ResizableHandle withHandle />
			{connectorMetadata.group !== ConnectorGroup.Core && (
				<ResizablePanel defaultSize={30} maxSize={80} onResize={(size) => setTestDataPanelHeight(size)}>
					<ActionTest
						panelSize={testDataPanelHeight}
						disabled={isEmpty(actionWatcher?.name) || Object.keys(actionForm.formState.errors).length !== 0}
						disabledMessage={isEmpty(actionWatcher?.props) ? 'Choose Action' : 'First fill all required Action fields'}
					/>
				</ResizablePanel>
			)}
		</ResizablePanelGroup>
	)
}
