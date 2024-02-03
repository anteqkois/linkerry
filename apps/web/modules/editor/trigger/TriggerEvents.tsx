import { json } from '@codemirror/lang-json'
import { CustomError, Id, assertNotNullOrUndefined } from '@linkerry/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@linkerry/ui-components/client'
import { Button, Icons, Muted, Small } from '@linkerry/ui-components/server'
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
	assertNotNullOrUndefined(editedTrigger?.name, 'editedTrigger.name')

	const { data, status, refetch } = useClientQuery({
		queryKey: ['trigger-events'],
		queryFn: () =>
			TriggerApi.getTriggerEvents({
				flowId: flow._id,
				triggerName: editedTrigger.name,
			}),
	})
	const [record, setRecord] = useState('')
	const onChangeTriggerEvent = useCallback(
		(newTriggerEventId: Id) => {
			if (!data?.data) return
			const triggerEvent = data.data.find((event) => event._id === newTriggerEventId)
			setRecord(JSON.stringify(triggerEvent?.payload, null, 2))
		},
		[data?.data],
	)

	useEffect(() => {
		if (status !== 'success') return

		console.log(data.data)
		if (data?.data.length) setRecord(JSON.stringify(data.data[0].payload, null, 2))
	}, [status])

	if (!editedTrigger) throw new CustomError('Can not retrive editedTrigger')
	if (status === 'pending') return <Spinner />

	const onClickTest = async () => {
		await testPoolTrigger(editedTrigger.name)
		await refetch()
	}

	return (
		<div>
			<div className="pt-3 pl-1">
				<Small>Generate Test Data</Small>
				<Muted>They can be used in next steps</Muted>
			</div>
			<div className="flex h-14 px-1 items-center justify-between gap-4">
				{data?.data.length && (
					<Select onValueChange={onChangeTriggerEvent}>
						<SelectTrigger className="w-full">
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
				<Button variant="secondary" onClick={onClickTest}>
					{testConnectorLoading ? <Icons.Spinner className="mr-2" /> : <Icons.Test className="mr-3" />}
					<span className="whitespace-nowrap">Generate Data</span>
				</Button>
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
		</div>
	)
}
