import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { Action, Trigger } from '@linkerry/shared'
import { Node } from 'reactflow'
import { ActionNodeProps, SelectTriggerNodeProps, TestFlowNodeProps, TriggerNodeProps } from '../types'

export const nodeConfigs = {
  gap: {
    x: 50,
    y: 50,
  },
  BaseNode: {
    width: 320,
    height: 100,
  },
  TestFlowNode: {
    width: 160,
    height: 40,
  },
} as const

export const selectTriggerNodeFactory = ({ trigger }: { trigger: Trigger }): SelectTriggerNodeProps => {
  return {
    id: trigger.name,
    type: 'SelectTriggerNode',
    position: { x: 0, y: 0 },
    data: {
      trigger,
    },
    draggable: false,
    height: nodeConfigs.BaseNode.height,
    width: nodeConfigs.BaseNode.width,
  }
}

export const triggerNodeFactory = ({
  trigger,
  connectorMetadata,
}: {
  trigger: Trigger
  connectorMetadata: ConnectorMetadataSummary
}): TriggerNodeProps => {
  return {
    id: trigger.name,
    type: 'TriggerNode',
    position: { x: 0, y: 0 },
    data: {
      trigger,
      connectorMetadata,
    },
    draggable: false,
    height: nodeConfigs.BaseNode.height,
    width: nodeConfigs.BaseNode.width,
  }
}

export const actionNodeFactory = ({
  action,
  connectorMetadata,
  position,
}: {
  action: Action
  connectorMetadata: ConnectorMetadataSummary
  position: Node['position']
}): ActionNodeProps => {
  return {
    id: action.name,
    type: 'ActionNode',
    position: position,
    data: {
      action,
      connectorMetadata,
      position,
    },
    draggable: false,
    height: nodeConfigs.BaseNode.height,
    width: nodeConfigs.BaseNode.width,
  }
}

export const testFlowNodeFactory = ({ position }: { position: Node['position'] }): TestFlowNodeProps => {
  return {
    id: 'test_flow',
    type: 'TestFlowNode',
    position: position,
    data: {
      position,
    },
    draggable: false,
    height: nodeConfigs.TestFlowNode.height,
    width: nodeConfigs.TestFlowNode.width,
  }
}
