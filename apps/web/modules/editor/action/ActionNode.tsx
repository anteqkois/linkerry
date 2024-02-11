import { Icons } from '@linkerry/ui-components/server'
import Image from 'next/image'
import { MouseEvent as ReactMouseEvent, useEffect } from 'react'
import { Handle, Position } from 'reactflow'
import { BaseNodeElement } from '../common/BaseNode'
import { AddAction } from '../steps/AddAction'
import { ActionNodeProps, CustomNodeProps } from '../types'
import { useEditor } from '../useEditor'

type ActionProps = CustomNodeProps<ActionNodeProps>

export const ActionNodeElement = ({ data: { action, connectorMetadata }, id }: ActionProps) => {
	const { setEditedAction, deleteAction, setEditStepMetadata } = useEditor()

	const onClickHandler = () => {
		setEditedAction(action)
	}

	// TODO support changing actions
	// const handleResetAction = () => {
	// 	resetAction(action.name)
	// }

	/* Currently only for last action */
	const handleDeleteAction = (event?: ReactMouseEvent<SVGElement, MouseEvent>) => {
		event?.stopPropagation()
		deleteAction(action.name)
	}

	useEffect(() => {
		return () => setEditStepMetadata(null)
	}, [])

	return (
		<>
			<BaseNodeElement
				title={action.displayName}
				valid={action.valid}
				invalidMessage="Invalid action, try edit settings"
				onClick={onClickHandler}
				className="group"
			>
				<Handle type="target" position={Position.Top} isConnectable={false} className="opacity-0"></Handle>
				<div className="flex gap-4">
					<Image width={64} height={64} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
					<div className="flex flex-col flex-wrap justify-center">
						<p className="font-bold">{action.displayName}</p>
						<p>{connectorMetadata.displayName}</p>
					</div>
				</div>
				<div className="opacity-20 group-hover:opacity-90 absolute top-1/2 -translate-y-1/2 -left-16">
					<Icons.Delete
						className="opacity-50 hover:opacity-100 bg-muted rounded-full p-2 text-negative border border-dashed border-negative w-12 h-12 center"
						onClick={handleDeleteAction}
						// onClick={(e) => {
						// 	e.stopPropagation()
						// 	handleDeleteAction()
						// }}
					/>
				</div>
				{/* <Handle type="source" position={Position.Bottom} id="addAction" isConnectable={false} className="-bottom-10">
				<Button size={'icon'} variant={'outline'}>
				<Icons.Plus />
				</Button>
			</Handle> */}
			</BaseNodeElement>
			{action.nextActionName ? null : <AddAction nodeId={id} />}
		</>
	)
}
