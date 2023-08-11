'use client'

import { useEffect, useMemo } from 'react'
import { Node } from 'reactflow'
import { ConditionNode, Editor, StrategyBuyNode, StrategyNode, StrategyNodeProps } from '../../../../../modules/editor'
import { useAsync, useLocalStorageValue } from '@react-hookz/web'
import { LocalStorageKeys } from '../../../../../types'
import { StrategyApi } from '../../../../../modules/strategies/api'
import { IStrategy } from '@market-connector/types'

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

// const initialNodes: Node[] = [
// {
//   id: 'strategyStart',
//   // type: 'group',
//   type: 'strategyNode',
//   position: { x: 0, y: 0 },
//   data: {},
// },
// {
//   id: 'addConditionButton',
//   type: 'conditionNode',
//   position: {
//     x: 0,
//     y: 0,
//   },
//   data: {},
//   deletable: false,
//   parentNode: 'strategyStart',
//   extent: 'parent',
//   expandParent: true,
// },
// {
//   id: 'addConditionButton2',
//   type: 'conditionNode',
//   position: {
//     x: 200,
//     y: 200,
//   },
//   data: {},
//   deletable: false,
//   parentNode: 'strategyStart',
//   extent: 'parent',
//   expandParent: true,
// },
// ]

const renderStrategyNodes = (strategy: IStrategy) => {
  return [
    {
      id: 'strategyStart',
      // type: 'group',
      type: 'strategyNode',
      position: { x: 0, y: 0 },
      data: {
        strategy,
      } as StrategyNodeProps['data'],
    },
  ]
}

export default function Page({ params }: { params: { id: string } }) {
  const { value, set, remove } = useLocalStorageValue<Node[]>(LocalStorageKeys.StrategyCache)
  const [state, actions] = useAsync<Node[]>(async () => {
    // Return cached Nodes state
    if (value) return value

    const id = params?.id?.[0]
    if (id) {
      // Fetch and render if exists
      const { data } = await StrategyApi.get(id)
      if (data && data._id === id) {
        const nodes = renderStrategyNodes(data)
        set(nodes)
        return nodes
      }
    }

    // Create new strategy
    return [
      {
        id: 'strategyStart',
        type: 'strategyNode',
        position: { x: 0, y: 0 },
        data: {},
      },
    ]
  })

  useEffect(() => {
    actions.execute()
    // Clean cache
    ;() => remove()
  }, [])

  return (
    <Editor
      initalData={{ edges: [], nodes: state.result ?? [] }}
      nodeTypes={nodeTypes}
      mode="production"
      limits={undefined}
      cache={{ saveState: undefined }}
    />
  )
}


  // const initialNodes: Node[] = await useMemo(async () => {
  //   // Return cached Nodes state
  //   if (value) return value

  //   const id = params?.id?.[0]
  //   if (id) {
  //     // Fetch and render if exists
  //     const { data } = await StrategyApi.get(id)
  //     if (data && data._id === id) {
  //       const nodes = renderStrategyNodes(data)
  //       set(nodes)
  //       return nodes
  //     }
  //   }

  //   // Create new strategy
  //   return [
  //     {
  //       id: 'strategyStart',
  //       type: 'strategyNode',
  //       position: { x: 0, y: 0 },
  //       data: {},
  //     },
  //   ]
  // }, [params])
