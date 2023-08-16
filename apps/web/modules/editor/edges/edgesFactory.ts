import { Edge } from 'reactflow'
import { CustomNodeId } from '../nodes'

export const defaultEdgeFactory = ({sourceNodeId, targetNodeId}: {sourceNodeId: CustomNodeId, targetNodeId : CustomNodeId}): Edge => {
  return {
    id: `${sourceNodeId}-${targetNodeId}`,
    type: 'smoothstep',
    source: sourceNodeId,
    target: targetNodeId,
  }
}
