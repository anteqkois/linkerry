import { ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { Trigger } from '@market-connector/shared'
import { CustomNodeType, SelectTriggerNodeProps, TriggerNodeProps } from '../types'

type NodeConfig = {
  width: number
  height: number
}

export const nodeConfigs: Record<CustomNodeType, NodeConfig> & { gap: { x: number; y: number } } = {
  gap: {
    x: 40,
    y: 40,
  },
  SelectTriggerNode: {
    width: 384,
    height: 428,
  },
  TriggerNode: {
    width: 384,
    height: 428,
  },
}

export const selectTriggerNodeFactory = ({ trigger }: { trigger: Trigger }): SelectTriggerNodeProps => {
  return {
    // id: `SelectTrigger_${trigger.name}`,
    id: trigger.id,
    type: 'SelectTriggerNode',
    position: { x: 0, y: 0 },
    data: {
      trigger,
    },
    draggable: false,
  }
}

export const triggerNodeFactory = ({ trigger, connectorMetadata }: { trigger: Trigger; connectorMetadata: ConnectorMetadataSummary }): TriggerNodeProps => {
  return {
    // id: `Trigger_${trigger.name}`,
    id: trigger.id,
    type: 'TriggerNode',
    position: { x: 0, y: 0 },
    data: {
      trigger,
      connectorMetadata,
    },
    draggable: false,
  }
}
