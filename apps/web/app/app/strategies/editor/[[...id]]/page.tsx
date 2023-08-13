'use client'

import { IStrategy } from '@market-connector/types'
import { useAsync, useLocalStorageValue } from '@react-hookz/web'
import { useEffect, useMemo } from 'react'
import { Edge, Node } from 'reactflow'
import {
  ConditionNode,
  CustomNode,
  Editor,
  IAddStrategyBuyNode,
  IStrategyBuyNode,
  IStrategyNode,
  StrategyBuyNode,
  StrategyNode,
} from '../../../../../modules/editor'
import { StrategyApi } from '../../../../../modules/strategies/api'
import { LocalStorageKeys } from '../../../../../types'
import { AddStrategyBuyNode } from '../../../../../modules/editor/nodes/shared/AddStrategyBuyNode'

const nodeTypes = {
  StrategyBuyNode: StrategyBuyNode,
  ConditionNode: ConditionNode,
  StrategyNode: StrategyNode,
  AddStrategyBuyNode: AddStrategyBuyNode,
}

const renderStrategyNodes = (strategy: IStrategy) => {
  const strategyNode: IStrategyNode = {
    id: 'Strategy',
    type: 'StrategyNode',
    position: { x: 0, y: 0 },
    data: {
      strategy,
    },
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

  const strategyBuyNode: IStrategyBuyNode = {
    id: 'StrategyBuy',
    type: 'StrategyBuyNode',
    position: { x: 218, y: 450 },
    data: {
      strategyBuy:{}
    },
    parentNode:'Strategy'
  }

  // return [strategyNode, addBuyStrategy]
  return [strategyNode, strategyBuyNode]
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
  const { value, set, remove } = useLocalStorageValue<CustomNode[]>(LocalStorageKeys.StrategyCache)

  const [initialNodes, actions] = useAsync<CustomNode[]>(async () => {
    const id = params?.id?.[0]
    // Return cached Nodes state => cached id must be equeal to params id, other ways it must be id of unsaved strategy
    if (
      (value && id && value[0].type === 'StrategyNode' && value[0].data?.strategy?._id === id) ||
      (value && value[0].type === 'StrategyNode' && !value[0].data?.strategy?._id)
    )
      return value

    if (id) {
      // Fetch and render if exists
      const { data } = await StrategyApi.get(id)
      if (data && data._id === id) {
        const nodes = renderStrategyNodes(data)
        // set(nodes)
        return nodes
      }
    }

    // Create new strategy
    return [
      {
        id: 'Strategy',
        type: 'StrategyNode',
        position: { x: 0, y: 0 },
        data: {
          strategy:{}
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
    ;() => remove()
  }, [])

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
