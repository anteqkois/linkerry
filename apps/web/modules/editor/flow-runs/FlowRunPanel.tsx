import { Form, ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@linkerry/ui-components/client'
import { useState } from 'react'

export const FlowRunPanel = () => {
	// const {  } = useEditor()
	const [stepDataPanelHeight, setStepDataPanelHeight] = useState(30)

	// const {
	// 	data: connectorMetadata,
	// 	isFetched,
	// 	isLoading,
	// 	error,
	// } = useClientQuery(
	// 	connectorsMetadataQueryConfig.getOne({
	// 		connectorName: editedAction.settings.connectorName,
	// 		connectorVersion: editedAction.settings.connectorVersion,
	// 	}),
	// )

	// if (isLoading) return <Spinner />
	// if (error) return <ErrorInfo errorObject={error} />
	// if (!connectorMetadata) return <ErrorInfo message="Can not find connector details" />

	return (
		<ResizablePanelGroup direction="vertical" className="max-h-screen">
			<ResizablePanel defaultSize={60} className="px-1">
				<div>panel</div>
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
