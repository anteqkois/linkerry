import { H5, Icons } from '@market-connector/ui-components/server'
import { useEditor } from '../../useEditor'
import { CustomNodeProps, SelectTriggerNodeProps } from '../types'
import { BaseNodeElement } from './BaseNode'

type SelectTriggerProps = CustomNodeProps<SelectTriggerNodeProps>

export const SelectTriggerNodeElement = ({ data: { trigger } }: SelectTriggerProps) => {
  const { setShowDrawer, showDrawer, setEditedTrigger } = useEditor()

  const handleOnClick = () => {
    setEditedTrigger(trigger)
    setShowDrawer(!showDrawer)
  }

  return (
    <BaseNodeElement title="Trigger" valid={false} invalidMessage="Invalid trigger, try edit settings" onClick={handleOnClick}>
      <div className="flex gap-6">
        <Icons.questionMarkCircle className="w-16 h-16" />
        <div>
          <H5>{trigger.displayName}</H5>
          <p>It will execute the flow</p>
        </div>
      </div>
    </BaseNodeElement>
  )
}