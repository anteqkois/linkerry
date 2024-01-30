import { json } from '@codemirror/lang-json'
import { CustomError, Id } from '@linkerry/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { Spinner } from '../../../shared/components/Spinner'
import { TriggerApi } from '../../flows/triggers/api'
import { useEditor } from '../useEditor'

export interface TriggerEventsProps extends HTMLAttributes<HTMLElement> {}

// export const TriggerEvents = ({}: TriggerEventsProps) => {
export const TriggerEvents = () => {
	const { flow, editedTrigger, testPoolTrigger, testConnectorLoading } = useEditor()
	const { data, isLoading, isSuccess } = useClientQuery({
		queryKey: ['trigger-events'],
		queryFn: () =>
			TriggerApi.getTriggerEvents({
				flowId: flow._id,
				triggerName: editedTrigger!.name,
			}),
	})
	const [record, setRecord] = useState('')

	useEffect(() => {
		if (!isSuccess) return

		if (data?.data) setRecord(JSON.stringify(data.data[0].payload, null, 2))
	}, [isSuccess])

	const onChangeTriggerEvent = useCallback(
		(newTriggerEventId: Id) => {
			if (!data?.data) return
			const triggerEvent = data.data.find((event) => event._id === newTriggerEventId)
			setRecord(JSON.stringify(triggerEvent?.payload, null, 2))
		},
		[data?.data],
	)

	if (!editedTrigger) throw new CustomError('Can not retrive editedTrigger')
	if (isLoading) return <Spinner />

	return (
		<>
			<div className="flex h-16 items-center gap-4">
				<Button variant="secondary" onClick={() => testPoolTrigger(editedTrigger.name)}>
					{testConnectorLoading ? <Icons.Spinner className="mr-2" /> : <Icons.Test className="mr-3" />}
					Generate Test Data
				</Button>
				{data?.data.length && (
					<Select onValueChange={onChangeTriggerEvent}>
						<SelectTrigger className="w-52">
							<SelectValue placeholder="Select other event" />
						</SelectTrigger>
						<SelectContent position="popper">
							{data.data.map((triggerEvent, index) => {
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
				)}
			</div>
			<div className="h-full pb-28">
				<CodeMirror
					readOnly={true}
					value={record}
					height="100%"
					style={{
						height: '100%',
					}}
					theme={vscodeDark}
					extensions={[json()]}
				/>
			</div>
		</>
	)
}
