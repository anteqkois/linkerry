import { CustomError, ErrorCode, Id, assertNotNullOrUndefined, isConnectorTrigger, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@linkerry/ui-components/client'
import { Icons, Muted, Small } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useRelativeTime } from '../../../libs/dayjs'
import { getBrowserQueryCllient, useClientQuery } from '../../../libs/react-query'
import { CodeEditor } from '../../../shared/components/Code/CodeEditor'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { TriggerApi } from '../../flows/triggers/api'
import { GenerateTestDataButton } from '../steps/GenerateTestDataButton'
import { useEditor } from '../useEditor'

export interface TriggerTestFunctionProps extends HTMLAttributes<HTMLElement> {
	panelSize: number
	disabled: boolean
	disabledMessage: string
}

export const TriggerTestFunction = ({ panelSize, disabled, disabledMessage }: TriggerTestFunctionProps) => {
	const { toast } = useToast()
	const { flow, editedTrigger, testPoolTrigger, flowOperationRunning, patchEditedTriggerConnector } = useEditor()
	assertNotNullOrUndefined(editedTrigger?.name, 'editedTrigger.name')
	if (!isConnectorTrigger(editedTrigger))
		throw new CustomError('Invalid trigger type, can not use other than ConnectorTrigger', ErrorCode.INVALID_TYPE, {
			editedTrigger,
		})

	const [record, setRecord] = useState('')
	const [selectedTriggerEventId, setSelectedTriggerEventId] = useState<string>()
	const { relativeTime, setInitialTime } = useRelativeTime()

	const { data, status, refetch } = useClientQuery({
		queryKey: ['trigger-events', editedTrigger.name],
		queryFn: async () => {
			const { data } = await TriggerApi.getTriggerEvents({
				flowId: flow._id,
				triggerName: editedTrigger.name,
			})
			return data
		},
	})

	const onChangeTriggerEvent = useCallback(
		async (newTriggerEventId: Id) => {
			if (!data) return
			setSelectedTriggerEventId(newTriggerEventId)
			const triggerEvent = data.find((event) => event._id === newTriggerEventId)
			assertNotNullOrUndefined(triggerEvent, 'triggerEvent')

			setRecord(prepareCodeMirrorValue(triggerEvent.payload))
			await patchEditedTriggerConnector({
				settings: {
					inputUiInfo: {
						currentSelectedData: triggerEvent.payload,
					},
				},
			})
		},
		[data],
	)

	useEffect(() => {
		// remve trigger events when trigger changed
		setRecord('')
		refetch()
	}, [editedTrigger.settings.triggerName])

	useEffect(() => {
		if (status !== 'success' || !data?.length) return
		if (!editedTrigger.settings.inputUiInfo.currentSelectedData || !editedTrigger.settings.inputUiInfo.lastTestDate) return

		setRecord(prepareCodeMirrorValue(editedTrigger.settings.inputUiInfo.currentSelectedData))
		setInitialTime(editedTrigger.settings.inputUiInfo.lastTestDate)
	}, [status])

	if (!editedTrigger) return <ErrorInfo message="Can not retrive editedTrigger" />
	if (status === 'pending') return <Spinner />

	const onClickTest = async () => {
		try {
			const triggerEvents = await testPoolTrigger()
			const queryClient = getBrowserQueryCllient()
			queryClient.setQueryData(['trigger-events', editedTrigger.name], triggerEvents)
			setRecord(prepareCodeMirrorValue(triggerEvents[triggerEvents.length - 1].payload))
			setSelectedTriggerEventId(triggerEvents[triggerEvents.length - 1]._id)
			setInitialTime(dayjs().format())
		} catch (error) {
			console.error(error)
			if (isCustomHttpExceptionAxios(error))
				toast({
					title: 'Loading trigger sample data failed',
					description: error.response.data.message,
					variant: 'destructive',
				})
		}
	}

	// TODO improve rerenndeing (change pane size debounce)
	return (
		<div>
			<div className="pt-3 pl-1">
				<Small>Generate sample sata</Small>
				<Muted>The sample sata can be used in next steps</Muted>
			</div>
			{data?.length ? (
				<>
					{/* TODO handle error state */}
					<div className="flex h-14 px-1 items-center justify-between gap-4">
						{data?.length ? (
							<div className="flex flex-row flex-wrap">
								<h5 className="flex items-center gap-2">
									<Icons.True className="text-positive" />
									Loaded data successfully
								</h5>
								<Muted className="ml-7">{relativeTime}</Muted>
							</div>
						) : null}
						<GenerateTestDataButton
							disabled={disabled}
							disabledMessage={disabledMessage}
							text="Regenerate Data"
							onClick={onClickTest}
							loading={flowOperationRunning}
						/>
					</div>
					<Select onValueChange={onChangeTriggerEvent} value={selectedTriggerEventId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select other event" />
						</SelectTrigger>
						<SelectContent position="popper">
							{data.map((triggerEvent, index) => {
								return (
									<SelectItem value={triggerEvent._id} key={triggerEvent._id}>
										<span className="flex gap-2 items-center">
											<p>
												Event {index + 1} - {dayjs(triggerEvent.createdAt).format('YYYY/MM/DD HH:mm:ss')}
											</p>
										</span>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				</>
			) : (
				<div className="flex h-20 px-1 flex-center">
					<GenerateTestDataButton
						disabled={disabled}
						disabledMessage={disabledMessage}
						text="Generate Data"
						onClick={onClickTest}
						loading={flowOperationRunning}
					/>
				</div>
			)}

			{record && <CodeEditor value={record} heightVh={panelSize} substractPx={180} title="Output" className="mt-2" />}
		</div>
	)
}
