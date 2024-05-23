import { H5, Icons } from '@linkerry/ui-components/server'
import { BaseNodeElement } from '../common/BaseNode'
import { CustomNodeProps, SelectTriggerNodeProps } from '../types'
import { useEditor } from '../useEditor'

type SelectTriggerProps = CustomNodeProps<SelectTriggerNodeProps>

export const SelectTriggerNodeElement = ({ data: { trigger } }: SelectTriggerProps) => {
  const { onClickSelectTrigger } = useEditor()

  const handleOnClick = () => {
    onClickSelectTrigger(trigger)
  }

  return (
    <BaseNodeElement
      title="Trigger"
      valid={false}
      invalidMessage="Invalid trigger, try edit settings, or generate new 'Sample Data'"
      onClick={handleOnClick}
    >
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
