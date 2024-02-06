import { Icons } from '@linkerry/ui-components/server'
import Image from 'next/image'
import { useEffect } from 'react'
import { Handle, Position } from 'reactflow'
import { BaseNodeElement } from '../common/BaseNode'
import { AddAction } from '../steps/AddAction'
import { CustomNodeProps, TriggerNodeProps } from '../types'
import { useEditor } from '../useEditor'

type TriggerProps = CustomNodeProps<TriggerNodeProps>

export const TriggerNodeElement = ({ data: { trigger, connectorMetadata }, id }: TriggerProps) => {
	const { setEditedTrigger, resetTrigger, setEditStepMetadata } = useEditor()

	const onClickHandler = () => {
		setEditedTrigger(trigger)
	}

	const handleResetTrigger = () => {
		resetTrigger(trigger.name)
	}

	useEffect(() => {
		return () => setEditStepMetadata(null)
	}, [])

	return (
		<>
			<BaseNodeElement
				title={trigger.displayName}
				valid={trigger.valid}
				invalidMessage="Invalid trigger, try edit settings"
				onClick={onClickHandler}
				className="group"
			>
				<div className="flex gap-4">
					<Image width={64} height={64} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
					<div className="flex flex-col flex-wrap justify-center">
						<p className="font-bold">{trigger.displayName}</p>
						<p>{connectorMetadata.displayName}</p>
					</div>
				</div>
				<div className="opacity-20 group-hover:opacity-90 absolute top-1/2 -translate-y-1/2 -left-16">
					<Icons.Change
						className="opacity-50 hover:opacity-100 bg-muted rounded-full p-2 text-muted-foreground border border-dashed border-muted-foreground w-12 h-12 center rotate-90"
						onClick={handleResetTrigger}
					/>
				</div>
				<Handle type="source" position={Position.Bottom} isConnectable={false} className="opacity-0"></Handle>
			</BaseNodeElement>
			{trigger.nextActionName ? null : <AddAction nodeId={id} />}
		</>
	)
}
