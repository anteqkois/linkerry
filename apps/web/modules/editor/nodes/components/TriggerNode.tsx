import { CustomNodeProps, TriggerNodeProps } from '..'
import { useEditor } from '../../useEditor'
import { BaseNodeElement } from './BaseNode'

type TriggerProps = CustomNodeProps<TriggerNodeProps>

export const TriggerNodeElement = ({ data: { trigger } }: TriggerProps) => {
  const { setShowDrawer, showDrawer } = useEditor()

  const onClickHandler = () =>{
    // Select correct drawer
    setShowDrawer(!showDrawer)
  }

  return (
    <BaseNodeElement title={trigger.displayName} description="Select Flow Trigger" valid={trigger.valid} invalidMessage='Invalid trigger, try edit settings' onClick={onClickHandler}/>
  )
}
