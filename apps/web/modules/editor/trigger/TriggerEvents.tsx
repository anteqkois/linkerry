import { json } from '@codemirror/lang-json'
import { Id, assertNotNullOrUndefined } from '@linkerry/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@linkerry/ui-components/client'
import { Button, Icons, Muted, Small } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { getBrowserQueryCllient, useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { TriggerApi } from '../../flows/triggers/api'
import { useEditor } from '../useEditor'

export interface TriggerEventsProps extends HTMLAttributes<HTMLElement> {
	panelSize: number
}

export const TriggerEvents = ({ panelSize }: TriggerEventsProps) => {
	const { flow, editedTrigger, testPoolTrigger, testConnectorLoading } = useEditor()
	assertNotNullOrUndefined(editedTrigger?.name, 'editedTrigger.name')

	const { data, status } = useClientQuery({
		queryKey: ['trigger-events', editedTrigger.name],
		queryFn: async () => {
			const { data } =await  TriggerApi.getTriggerEvents({
				flowId: flow._id,
				triggerName: editedTrigger.name,
			})
			return data
		},
	})
	const [record, setRecord] = useState('')
	const [selectedTriggerEventId, setSelectedTriggerEventId] = useState<string>('')
	const onChangeTriggerEvent = useCallback(
		(newTriggerEventId: Id) => {
			if (!data) return
			const triggerEvent = data.find((event) => event._id === newTriggerEventId)
			setRecord(JSON.stringify(triggerEvent?.payload, null, 2))
		},
		[data],
	)

	useEffect(() => {
		if (status !== 'success' || !data?.length) return
		const lastTriggerEvent = data[data.length - 1]
		setRecord(JSON.stringify(lastTriggerEvent.payload, null, 2))
		setSelectedTriggerEventId(lastTriggerEvent._id)
	}, [status, data?.length])

	if (!editedTrigger) return <ErrorInfo message="Can not retrive editedTrigger" />
	if (status === 'pending') return <Spinner />

	const onClickTest = async () => {
		const triggerEvents = await testPoolTrigger(editedTrigger.name)
		const queryClient = getBrowserQueryCllient()
		queryClient.setQueryData(['trigger-events', editedTrigger.name], triggerEvents)
		setSelectedTriggerEventId(triggerEvents[triggerEvents.length -1]._id)
	}

	// TODO improve rerenndeing (change pane size debounce)
	return (
		<div>
			<div className="pt-3 pl-1">
				<Small>Generate sample sata</Small>
				<Muted>The sample sata can be used in next steps</Muted>
			</div>
			<div className={cn('flex h-14 px-1 items-center gap-4', data?.length ? 'justify-between' : 'justify-center ')}>
				{data?.length ? (
					<Select onValueChange={onChangeTriggerEvent} value={selectedTriggerEventId}>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Select other event" />
						</SelectTrigger>
						<SelectContent position="popper">
							{data.map((triggerEvent, index) => {
								return (
									<SelectItem value={triggerEvent._id} key={triggerEvent._id}>
										<span className="flex gap-2 items-center">
											<p>Trigger event {index + 1}</p>
										</span>
									</SelectItem>
								)
							})}
						</SelectContent>
					</Select>
				) : null}
				<Button variant="secondary" onClick={onClickTest}>
					{testConnectorLoading ? <Icons.Spinner className="mr-2" /> : <Icons.Test className="mr-3" />}
					<span className="whitespace-nowrap">Generate Data</span>
				</Button>
			</div>
			{record && (
				<div>
					<CodeMirror
						readOnly={true}
						value={record}
						style={{
							overflow: 'scroll',
							height: `calc(${panelSize}vh - 150px)`,
						}}
						theme={vscodeDark}
						extensions={[json()]}
					/>
				</div>
			)}
		</div>
	)
}
