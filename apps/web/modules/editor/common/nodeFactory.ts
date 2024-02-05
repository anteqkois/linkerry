import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { Action, Trigger } from '@linkerry/shared'
import { Node } from 'reactflow'
import { ActionNodeProps, CustomNodeType, SelectTriggerNodeProps, TriggerNodeProps } from '../types'

type NodeConfig = {
	width: number
	height: number
}

export const nodeConfigs: Record<CustomNodeType, NodeConfig> & { gap: { x: number; y: number } } = {
	gap: {
		x: 50,
		y: 50,
	},
	SelectTriggerNode: {
		width: 384,
		height: 100,
	},
	TriggerNode: {
		width: 384,
		height: 100,
	},
	ActionNode: {
		width: 384,
		height: 100,
	},
}

export const selectTriggerNodeFactory = ({ trigger }: { trigger: Trigger }): SelectTriggerNodeProps => {
	return {
		id: trigger.name,
		type: 'SelectTriggerNode',
		position: { x: 0, y: 0 },
		data: {
			trigger,
		},
		draggable: false,
		height: nodeConfigs.SelectTriggerNode.height,
		width: nodeConfigs.SelectTriggerNode.width,
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
		height: nodeConfigs.TriggerNode.height,
		width: nodeConfigs.TriggerNode.width,
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
		height: nodeConfigs.ActionNode.height,
		width: nodeConfigs.ActionNode.width,
	}
}
