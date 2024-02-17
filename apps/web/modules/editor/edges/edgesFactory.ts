import { Edge } from 'reactflow';
import { CustomNodeId } from '../types';
import { CustomEdgeId } from './types';

export const generateEdgeId = (sourceNodeId: CustomNodeId, targetNodeId: CustomNodeId): CustomEdgeId => `${sourceNodeId}-${targetNodeId}`

export const defaultEdgeFactory = ({ sourceNodeId, targetNodeId }: { sourceNodeId: CustomNodeId; targetNodeId: CustomNodeId }): Edge => {
	return {
		id: generateEdgeId(sourceNodeId, targetNodeId),
		type: 'smoothstep',
		style: { strokeWidth: 1.5, strokeDasharray: '3 2' },
		source: sourceNodeId,
		target: targetNodeId,
	}
}
