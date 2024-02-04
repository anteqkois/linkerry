import { Button, Icons, Muted } from '@linkerry/ui-components/server'
import Image from 'next/image'
import { useEffect } from 'react'
import { ActionNodeProps, CustomNodeProps } from '..'
import { useEditor } from '../../useEditor'
import { BaseNodeElement } from './BaseNode'

type ActionProps = CustomNodeProps<ActionNodeProps>

export const ActionNodeElement = ({ data: { action, connectorMetadata }, id }: ActionProps) => {
	const { setEditedAction, deleteAction, onClickSelectAction, setEditStepMetadata } = useEditor()

	const onClickHandler = () => {
		setEditedAction(action)
	}

	// TODO support changing actions
	// const handleResetAction = () => {
	// 	resetAction(action.name)
	// }

	/* Currently only for last action */
	const handleDeleteAction = () => {
		deleteAction(action.name)
	}

	useEffect(() => {
		return () => setEditStepMetadata(null)
	}, [])

	return (
		<div>
			<BaseNodeElement
				title={action.displayName}
				valid={action.valid}
				invalidMessage="Invalid action, try edit settings"
				onClick={onClickHandler}
				className="group"
			>
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
					/>
				</div>
				{/* <Handle type="source" position={Position.Bottom} id="addAction" isConnectable={false} className="-bottom-10">
				<Button size={'icon'} variant={'outline'}>
				<Icons.Plus />
				</Button>
			</Handle> */}
			</BaseNodeElement>
			<div className="h-20 w-10 absolute -bottom-20 left-1/2 -translate-x-1/2 center">
				<span className="h-20 w-0.5 absolute left-1/2 -translate-x-1/2 center border border-muted-foreground/50 border-dashed -z-10" />
				<Button size={'icon'} variant={'outline'} className="min-w-max" onClick={() => onClickSelectAction(id)}>
					<Icons.Plus />
				</Button>
				<div className="absolute -bottom-8 left-1/2 -translate-x-1/2 border border-muted-foreground/50 border-dashed rounded-md p-1">
					<Muted>End</Muted>
				</div>
			</div>
		</div>
	)
}
