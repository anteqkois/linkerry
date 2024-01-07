import { Icons } from '@market-connector/ui-components/server'
import Image from 'next/image'
import { CustomNodeProps, TriggerNodeProps } from '..'
import { useEditor } from '../../useEditor'
import { BaseNodeElement } from './BaseNode'

type TriggerProps = CustomNodeProps<TriggerNodeProps>

export const TriggerNodeElement = ({ data: { trigger, connectorMetadata } }: TriggerProps) => {
  const { setShowDrawer, showDrawer, setEditedTrigger, setDrawer, resetTrigger } = useEditor()

  const onClickHandler = () => {
    setEditedTrigger(trigger)
    setDrawer('trigger')
    setShowDrawer(!showDrawer)
  }
  // generateEmptyTrigger(new Types.ObjectId().toString())

  const handleResetTrigger = () => {
    resetTrigger(trigger.name)
  }

  return (
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
    </BaseNodeElement>
  )
}
