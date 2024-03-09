import { Button, Icons, Muted } from '@linkerry/ui-components/server'
import { HTMLAttributes } from 'react'
import { CustomNode } from '../types'
import { useEditor } from '../useEditor'

export interface AddActionProps extends HTMLAttributes<HTMLElement> {
	nodeId: CustomNode['id']
}

export const AddAction = ({nodeId}: AddActionProps) => {
	const { onClickSelectAction} = useEditor()

	return (
		<div className="h-16 w-10 absolute -bottom-16 left-1/2 -translate-x-1/2 flex-center">
			<span className="h-16 w-0.5 absolute left-1/2 -translate-x-1/2 flex-center border border-muted-foreground/50 border-dashed -z-10" />
			<Button size={'icon'} variant={'outline'} className="min-w-max" onClick={() => onClickSelectAction(nodeId)}>
				<Icons.Plus />
			</Button>
			<div className="absolute -bottom-10 left-1/2 -translate-x-1/2 border border-muted-foreground/50 border-dashed rounded-md p-2">
				<Muted>End</Muted>
			</div>
		</div>
	)
}
