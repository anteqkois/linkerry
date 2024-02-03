import { H5, Icons } from '@linkerry/ui-components/server'
import { useEditor } from '../../useEditor'
import { CustomNodeProps, SelectTriggerNodeProps } from '../types'
import { BaseNodeElement } from './BaseNode'

type SelectTriggerProps = CustomNodeProps<SelectTriggerNodeProps>

export const SelectTriggerNodeElement = ({ data: { trigger } }: SelectTriggerProps) => {
	const { onClickSelectTrigger } = useEditor()

	const handleOnClick = () => {
		onClickSelectTrigger(trigger)
	}

	return (
		<BaseNodeElement title="Trigger" valid={false} invalidMessage="Invalid trigger, try edit settings" onClick={handleOnClick}>
			<div className="flex gap-6">
				<Icons.QuestionMarkCircle className="w-16 h-16" />
				<div>
					<H5>{trigger.displayName}</H5>
					<p>It will execute the flow</p>
				</div>
			</div>
		</BaseNodeElement>
	)
}
