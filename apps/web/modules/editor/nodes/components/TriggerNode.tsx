import { H5 } from '@market-connector/ui-components/server'
import Image from 'next/image'
import { CustomNodeProps, TriggerNodeProps } from '..'
import { useEditor } from '../../useEditor'
import { BaseNodeElement } from './BaseNode'

type TriggerProps = CustomNodeProps<TriggerNodeProps>

export const TriggerNodeElement = ({ data: { trigger, connectorMetadata } }: TriggerProps) => {
  const { setShowDrawer, showDrawer, setEditedTrigger, setDrawer } = useEditor()

  const onClickHandler = () => {
    setEditedTrigger(trigger)
    setDrawer('trigger')
    setShowDrawer(!showDrawer)
  }

  return (
    <BaseNodeElement title={trigger.displayName} valid={trigger.valid} invalidMessage="Invalid trigger, try edit settings" onClick={onClickHandler}>
      <div className="flex gap-6">
        <Image width={64} height={64} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
        <div>
          <H5>{trigger.displayName}</H5>
          <p>{connectorMetadata.displayName}</p>
        </div>
      </div>
    </BaseNodeElement>
  )
}
