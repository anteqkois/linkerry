'use client'

import { Node } from 'reactflow'
import { ConditionNode, Editor, StrategyBuyNode, StrategyNode } from '../../../../../modules/editor'

const nodeTypes = {
  strategyBuyNode: StrategyBuyNode,
  conditionNode: ConditionNode,
  strategyNode: StrategyNode,
}

// const initialNodes: Node[] = [
//   {
//     id: 'A',
//     // type: 'group',
//     type: 'strategyBuyNode',
//     position: { x: 0, y: 0 },
//     style: {
//       // width: 500,
//       // height: 250,
//     },
//     data: {},
//   },
//   {
//     id: 'addConditionButton',
//     type: 'conditionNode',
//     position: {
//       x: 0,
//       y: 0,
//     },
//     data: {},
//     deletable: false,
//     // draggable: false,
//     parentNode: 'A',
//     extent: 'parent',
//     expandParent: true,
//   },
//   {
//     id: 'addConditionButton2',
//     type: 'conditionNode',
//     position: {
//       x: 100,
//       y: 100,
//     },
//     data: {},
//     deletable: false,
//     // draggable: false,
//     parentNode: 'A',
//     extent: 'parent',
//     expandParent: true,
//   },
// ]

const initialNodes: Node[] = [
  {
    id: 'strategyStart',
    // type: 'group',
    type: 'strategyNode',
    position: { x: 0, y: 0 },
    data: {},
  },
  // {
  //   id: 'addConditionButton',
  //   type: 'conditionNode',
  //   position: {
  //     x: 0,
  //     y: 0,
  //   },
  //   data: {},
  //   deletable: false,
  //   // draggable: false,
  //   parentNode: 'A',
  //   extent: 'parent',
  //   expandParent: true,
  // },
  // {
  //   id: 'addConditionButton2',
  //   type: 'conditionNode',
  //   position: {
  //     x: 100,
  //     y: 100,
  //   },
  //   data: {},
  //   deletable: false,
  //   // draggable: false,
  //   parentNode: 'A',
  //   extent: 'parent',
  //   expandParent: true,
  // },
]

export default function Page({ params }: { params: { id: string } }) {
  console.log(params.id[0]);

  return (
    <Editor
      initalData={{ edges: [], nodes: initialNodes }}
      nodeTypes={nodeTypes}
      mode="production"
      limits={undefined}
      cache={{ saveState: undefined, restoreState: undefined }}
    />
  )
}
