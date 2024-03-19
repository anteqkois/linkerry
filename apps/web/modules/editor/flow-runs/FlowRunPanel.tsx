import { CustomError, ErrorCode, assertNotNullOrUndefined, isStepBaseSettings } from '@linkerry/shared'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@linkerry/ui-components/client'
import { P } from '@linkerry/ui-components/server'
import { useQueries } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { flowRunQueryConfig } from '../../flows/flow-runs/query-config'
import { flowVersionQueryConfig } from '../../flows/flows-version/query-config'
import { useEditor } from '../useEditor'
import { StepItem } from './StepItem'

export const FlowRunPanel = () => {
	const { selectedFlowRunId } = useEditor()
	assertNotNullOrUndefined(selectedFlowRunId, 'selectedFlowRunId')
	const [stepDataPanelHeight, setStepDataPanelHeight] = useState(30)

	const {
		data: flowRun,
		isFetched: isFetchedFlowRun,
		isLoading: isLoadingFlowRun,
		error: errorFlowRun,
	} = useClientQuery({
		...flowRunQueryConfig.getOne({
			flowRunId: selectedFlowRunId,
		}),
	})

	const {
		data: flowVersion,
		isFetched: isFetchedFlowVersion,
		isLoading: isLoadingFlowVersion,
		error: errorFlowVersion,
	} = useClientQuery({
		...flowVersionQueryConfig.getOne({
			flowVersionId: flowRun?.flowVersionId ?? '',
		}),
		enabled: isFetchedFlowRun && !!flowRun?.flowVersionId,
	})

	const connectorsMetadata = useQueries({
		queries: flowVersion
			? [
					...Object.values(flowVersion.triggers).map((trigger) => {
						if (!isStepBaseSettings(trigger.settings)) throw new CustomError(`invalid settings for step ${trigger.name}`, ErrorCode.INVALID_TYPE)
						return connectorsMetadataQueryConfig.getOne({
							connectorName: trigger.settings.connectorName,
							connectorVersion: trigger.settings.connectorVersion,
						})
					}),
					...Object.values(flowVersion.actions).map((action) => {
						if (!isStepBaseSettings(action.settings)) throw new CustomError(`invalid settings for step ${action.name}`, ErrorCode.INVALID_TYPE)
						return connectorsMetadataQueryConfig.getOne({
							connectorName: action.settings.connectorName,
							connectorVersion: action.settings.connectorVersion,
						})
					}),
			  ]
			: [],
	})

	const steps = useMemo(() => {
		if (isLoadingFlowRun || isLoadingFlowVersion || connectorsMetadata.some((result) => result.isLoading)) return []
		assertNotNullOrUndefined(flowRun?.steps, 'flowRun?.steps')
		return Object.entries(flowRun?.steps).map(([stepName, result]) => {
			if (stepName.startsWith('trigger')) {
				const trigger = flowVersion?.triggers.find((trigger) => trigger.name === stepName)
				if (!isStepBaseSettings(trigger?.settings)) throw new CustomError(`invalid settings for step ${trigger?.name}`, ErrorCode.INVALID_TYPE)
				const connectorMetadata = connectorsMetadata.find((result) => result.data?.name === trigger.settings.connectorName)
				assertNotNullOrUndefined(connectorMetadata?.data, 'connectorMetadata')

				return {
					step: trigger,
					result,
					connectorMetadata: connectorMetadata.data,
				}
			} else if (stepName.startsWith('action')) {
				const action = flowVersion?.actions.find((action) => action.name === stepName)
				if (!isStepBaseSettings(action?.settings)) throw new CustomError(`invalid settings for step ${action?.name}`, ErrorCode.INVALID_TYPE)
				const connectorMetadata = connectorsMetadata.find((result) => result.data?.name === action.settings.connectorName)
				assertNotNullOrUndefined(connectorMetadata?.data, 'connectorMetadata')

				return {
					step: action,
					result,
					connectorMetadata: connectorMetadata.data,
				}
			} else throw new CustomError(`Can not infer step type`, ErrorCode.INVALID_TYPE, steps)
		})
		// console.log('FETCHED')
	}, [isLoadingFlowRun, isLoadingFlowVersion, connectorsMetadata.some((result) => result.isLoading)])

	if (isLoadingFlowRun || isLoadingFlowVersion) return <Spinner />
	if (errorFlowRun) return <ErrorInfo errorObject={errorFlowRun} />
	if (errorFlowVersion) return <ErrorInfo errorObject={errorFlowVersion} />
	if (!flowRun) return <P>Can not find flow run details</P>
	if (!flowVersion) return <P>Can not find flow version details</P>
	if (connectorsMetadata.some((result) => result.isError)) return <ErrorInfo message="Can not fetch connectors details" />

	return (
		<ResizablePanelGroup direction="vertical" className="max-h-screen pt-2">
			<ResizablePanel defaultSize={60} className="px-1">
				<div className="space-y-8">
					{steps.map((stepData, index) => (
						<StepItem {...stepData} stepNumber={++index} key={stepData.step.name} />
					))}
				</div>
				{/* {JSON.stringify(flowRun ?? '{}')} */}
				{/* {JSON.stringify(flowVersion ?? '{}')} */}
				{/* <div>panel</div> */}
				{/* {JSON.stringify(flowRun)} */}
				{/* <div className="flex items-center justify-center gap-2">
					<Image width={36} height={36} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
					<div>
						<H5>{connectorMetadata.displayName}</H5>
					</div>
				</div> */}

				{/* <Form {...actionForm}>
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
					</form>

				</Form>
				 */}
			</ResizablePanel>
			<ResizableHandle withHandle />
			{/* {connectorMetadata.group !== ConnectorGroup.CORE && (
				<ResizablePanel defaultSize={30} maxSize={80} onResize={(size) => setStepDataPanelHeight(size)}>
					<ActionTest
						panelSize={stepDataPanelHeight}
						disabled={isEmpty(actionWatcher?.name) || Object.keys(actionForm.formState.errors).length !== 0}
						disabledMessage={isEmpty(actionWatcher?.props) ? 'Choose Action' : 'First fill all required Action fields'}
					/>
				</ResizablePanel>
			)} */}
		</ResizablePanelGroup>
	)
}
