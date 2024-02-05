import { Edge } from 'reactflow';
import { CustomNodeId } from '../nodes';

export const defaultEdgeFactory = ({ sourceNodeId, targetNodeId }: { sourceNodeId: CustomNodeId; targetNodeId: CustomNodeId }): Edge => {
	return {
		id: `${sourceNodeId}-${targetNodeId}`,
		type: 'smoothstep',
		style: { strokeWidth: 1.5, strokeDasharray: '3 2' },
		source: sourceNodeId,
		target: targetNodeId,
	}
}
