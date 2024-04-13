import { ActionBase, getRefreshersToRefreshedProperties } from '@linkerry/connectors-framework'
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
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { DynamicValueModal } from '../components/DynamicValueModal'
import { FieldResolver } from '../form/FieldResolver'
import { ConnectionsSelect } from '../form/Inputs/ConnectionsSelect'
import { ConnectorVersion } from '../steps/ConnectorVersion'
import { retriveStepInputFromObject } from '../steps/retriveStepInputFromObject'
import { useEditor } from '../useEditor'
import { ActionTest } from './ActionTest'

export const ActionConnectorPanel = () => {
	const { editedAction, patchEditedAction, updateEditedAction, setEditedConnectorMetadata, flowOperationRunning } = useEditor()
	if (!editedAction || editedAction?.type !== ActionType.CONNECTOR) throw new Error('Missing editedAction')
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

	const refreshersToRefreshedProperties = useMemo(() => {
		if (!actionWatcher?.props) return {}
		return getRefreshersToRefreshedProperties(actionWatcher?.props)
	}, [actionWatcher?.props])

	// setup form fields on start based on editedAction input values (db), also set temp values (which shouldn't be saved in db )
	useEffect(() => {
		if (!isFetched) return
		assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata', editedAction.settings)
		setEditedConnectorMetadata(connectorMetadata)

		if (editedAction.type !== ActionType.CONNECTOR || editedAction.settings.actionName === '') {
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
		[Object.values(editedAction.settings.input)],
		1000,
	)

	useEffect(() => {
		const subscription = actionForm.watch(handleWatcher)
		return () => subscription.unsubscribe()
	}, [editedAction.settings.connectorName, handleWatcher])

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

		await updateEditedAction({
			name: editedAction.name,
			valid: false,
			displayName: selectedAction.displayName,
			type: ActionType.CONNECTOR,
			settings: {
				// errorHandlingOptions:{
				// 	continueOnFailure: true,
				// 	retryOnFailure: true
				// },
				packageType: connectorMetadata.packageType,
				connectorName: connectorMetadata.name,
				connectorVersion: connectorMetadata.version,
				connectorType: connectorMetadata.connectorType,
				actionName: selectedAction.name,
				input,
				inputUiInfo: {},
			},
			nextActionName: '',
		})

		// must be after updateEditedAction becouse form fields uses data form editor store and generate form based on it
		actionForm.reset({
			__temp__action: selectedAction,
			actionName,
			...input,
		})
	}

	return (
		<ResizablePanelGroup direction="vertical" className="max-h-screen p-1">
			<ResizablePanel defaultSize={60} className="px-1 overflow-scroll">
				<div className="flex items-center justify-center gap-2">
					<Image width={36} height={36} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
					<div>
						<H5>{connectorMetadata.displayName}</H5>
					</div>
				</div>
				<Form {...actionForm}>
					<form className="space-y-8 mt-6" onSubmit={(e) => e.preventDefault()}>
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
												<SelectValue placeholder="Select action">
													<p>{actionWatcher?.displayName}</p>
												</SelectValue>
											</SelectTrigger>
											<SelectContent position="popper">
												{Object.values(connectorMetadata.actions).map((action) => {
													return (
														<SelectItem value={action.name} key={action.name}>
															<p>{action.displayName}</p>
															<p className="text-xs text-muted-foreground">{action.description}</p>
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
							Object.entries(actionWatcher.props).map(([name, property]) => (
								<FieldResolver property={property} refreshedProperties={refreshersToRefreshedProperties[name]} name={name} key={name} />
							))}
					</form>
				</Form>
				<ConnectorVersion connectorMetadata={connectorMetadata} className="mt-4" />
			</ResizablePanel>
			<ResizableHandle withHandle />
			{connectorMetadata.group !== ConnectorGroup.CORE && (
				<ResizablePanel
					defaultSize={editedAction.settings.inputUiInfo.currentSelectedData ? 60 : 30}
					maxSize={80}
					onResize={(size) => setTestDataPanelHeight(size)}
				>
					<ActionTest
						panelSize={testDataPanelHeight}
						disabled={isEmpty(actionWatcher?.name) || Object.keys(actionForm.formState.errors).length !== 0 || flowOperationRunning}
						disabledMessage={flowOperationRunning ? 'Flow operation is running' : 'First fill all required Action fields'}
					/>
				</ResizablePanel>
			)}
			<DynamicValueModal />
		</ResizablePanelGroup>
	)
}
