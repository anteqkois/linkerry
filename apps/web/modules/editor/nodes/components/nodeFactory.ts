import { Trigger } from '@market-connector/shared'
import { AddNodeProps, CustomNodeId, CustomNodeType, TriggerNodeProps } from '../types'

type NodeConfig = {
  width: number
  height: number
}

export const nodeConfigs: Record<CustomNodeType, NodeConfig> & { gap: { x: number; y: number } } = {
  gap: {
    x: 40,
    y: 40,
  },
  AddNode: {
    width: 139,
    height: 40,
  },
  TriggerNode: {
    width: 384,
    height: 428,
  },
}

export const addNodeFactory = ({
  parentNodeId,
  x,
  y,
  variant,
  text,
}: {
  parentNodeId: CustomNodeId
  x: number
  y: number
  variant: CustomNodeType
  text: string
}): AddNodeProps => ({
  id: 'Add_Temp',
  type: 'AddNode',
  position: { x, y },
  data: {
    parentNodeId,
    variant,
    text,
  },
  parentNode: parentNodeId,
})

export const TriggerNodeFactory = ({ trigger }: { trigger: Trigger }): TriggerNodeProps => {
  return {
    id: `Trigger_${trigger.name}`,
    type: 'TriggerNode',
    position: { x: 0, y: 0 },
    data: {
      trigger,
    },
    draggable: false,
  }
}
