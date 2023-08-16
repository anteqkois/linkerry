'use client'

import { IStrategyExpand } from '@market-connector/types'
import { useAsync, useLocalStorageValue } from '@react-hookz/web'
import { useEffect, useMemo } from 'react'
import { Edge, Node } from 'reactflow'
import {
  ConditionNode,
  CustomNode,
  Editor,
  IStrategyBuyNode,
  IStrategyNode,
  StrategyBuyNode,
  StrategyNode,
} from '../../../../../modules/editor'
import { AddStrategyBuyNode } from '../../../../../modules/editor/nodes/shared/AddStrategyBuyNode'
import { StrategyApi } from '../../../../../modules/strategies/api'
import { LocalStorageKeys } from '../../../../../types'
import { addBuyStrategyNodeFactory } from '../../../../../modules/editor/nodes/shared/nodeFactory'

const nodeTypes = {
  StrategyNode: StrategyNode,
  StrategyBuyNode: StrategyBuyNode,
  ConditionNode: ConditionNode,
  AddStrategyBuyNode: AddStrategyBuyNode,
}

const renderStrategyNodes = (strategy: IStrategyExpand<'strategyBuy.strategyBuy'>) => {
  const nodes: CustomNode[] = []
  const strategyNode: IStrategyNode = {
    id: `Strategy_${strategy._id}`,
    type: 'StrategyNode',
    position: { x: 0, y: 0 },
    data: {
      strategy,
    },
  }
  nodes.push(strategyNode)

  if (!strategy.strategyBuy.length) {
    // nodes.push(addBuyStrategyNodeFactory({ parentId: strategyNode.id, x: node?.width ?? 0 / 2, y: node?.height ?? 0 + 20 }))
    nodes.push(addBuyStrategyNodeFactory({ parentNodeId: strategyNode.id, x: 123, y: 420 }))
  }

  // const addBuyStrategy: IAddStrategyBuyNode = {
  //   id: 'AddStrategyBuy',
  //   type: 'AddStrategyBuyNode',
  //   position: { x: 218, y: 450 },
  //   data: {
  //     parentId: strategyNode.id,
  //   },
  //   parentNode: 'Strategy',
  // }

  // const strategyBuyNode: IStrategyBuyNode = {
  //   id: 'StrategyBuy_1',
  //   type: 'StrategyBuyNode',
  //   position: { x: 0, y: 450 },
  //   data: {
  //     strategyBuy:{},
  //     strategyId: strategy._id
  //   },
  //   parentNode:'Strategy'
  // }
  // const strategyBuyNodes: IStrategyBuyNode[] = strategy.strategyBuy.map((sb) => {
  //   return {
  //     id: `StrategyBuy_${sb.id}`,
  //     type: 'StrategyBuyNode',
  //     position: { x: 0, y: 450 },
  //     data: {
  //       // strategyBuy: sb.strategyBuy,
  //       strategyBuy: sb,
  //       strategyId: strategy._id,
  //     },
  //     parentNode: `Strategy_${strategy._id}`,
  //   }
  // })

  // return [strategyNode, addBuyStrategy]
  // return [strategyNode, strategyBuyNode]
  return nodes
}

const renderStrategyEdges = (nodes: Node[]): Edge[] => {
  return [
    {
      id: 'Strategy-AddStrategyBuy',
      type: 'default',
      source: 'Strategy',
      target: 'AddStrategyBuyNode',
    },
  ]
}

// Always first node Should be strategy node with strategy id
export default function Page({ params }: { params: { id: string } }) {
  const { value, remove } = useLocalStorageValue<CustomNode[]>(LocalStorageKeys.StrategyCache)

  const [initialNodes, actions] = useAsync<CustomNode[]>(async () => {
    // Id from url
    const id = params?.id?.[0]

    // Return cached Nodes state => cached id must be equeal to params id, other ways it must be id of unsaved strategy
    if (
      (value && id && value[0].type === 'StrategyNode' && value[0].data?.strategy?._id === id) ||
      (value && value[0].type === 'StrategyNode' && !value[0].data?.strategy?._id)
    )
      return value

    if (id) {
      // Fetch and render if exists
      const { data } = await StrategyApi.get(id, {
        expand: ['strategyBuy.strategyBuy'],
      })
      if (data && data._id === id) {
        const nodes = renderStrategyNodes(data)
        // set(nodes)
        return nodes
      }
    }

    // Create new strategy
    return [
      {
        id: 'Strategy_Temp',
        type: 'StrategyNode',
        position: { x: 0, y: 0 },
        data: {
          strategy: undefined,
        },
      },
    ]
  })

  const initialEdges = useMemo(() => {
    return renderStrategyEdges(initialNodes.result ?? [])
  }, [initialNodes.result])

  useEffect(() => {
    actions.execute()
    // Clean cache
    return remove()
  }, [actions, remove])

  return (
    <Editor
      initalData={{ edges: initialEdges, nodes: initialNodes.result ?? [] }}
      nodeTypes={nodeTypes}
      mode="production"
      limits={undefined}
      cache={{ saveState: undefined }}
    />
  )
}
