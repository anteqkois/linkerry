import { useCallback } from 'react'
import { Handle, Node, NodeProps, Position, useReactFlow } from 'reactflow'

type Props = NodeProps

export function AddConditionNode({ data, xPos, yPos }: Props) {
  // const onClickAdd = useCallback(() => {
  //   const newId = +nodes[nodes.length - 1].id + 1;

  //   const newNode: Node = {
  //     id: newId.toString(),
  //     // we are removing the half of the node width (75) to center the new node
  //     // position: project({ x: event.clientX - left - 75, y: event.clientY - top }),
  //     type: 'condition',
  //     position: project({ x: 0, y: yPos + 100 }),
  //     data: {
  //       _id: newId,
  //       id: newId,
  //       type: "Alert",
  //       user: "fji44miko3oj3902",
  //       name: `Test Alert ${newId}`,
  //       requiredValue: 1,
  //       operator: "Equal",
  //       triggeredTimes: newId,
  //       active: true,
  //       eventValidityUnix: 49378124,
  //       testMode: false,
  //       isMarketProvider: false,
  //       alert: {
  //         provider: "Trading View",
  //       },
  //     },
  //     deletable: false
  //   };

  //   // const newNodes = [...nodes, newNode];
  //   // console.log(newNodes);

  //   // setNodes(newNodes);
  //   setNodes(nds => [...nds, newNode]);
  // }, [project]);

  return <div>Add Condition</div>
}
