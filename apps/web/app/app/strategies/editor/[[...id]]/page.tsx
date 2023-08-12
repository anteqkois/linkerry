'use client'

import { IStrategy } from '@market-connector/types'
import { useAsync, useLocalStorageValue } from '@react-hookz/web'
import { useCallback, useEffect, useMemo } from 'react'
import { Edge, Node } from 'reactflow'
import { ConditionNode, Editor, IStrategyNode, StrategyBuyNode, StrategyNode } from '../../../../../modules/editor'
import { AddStrategyBuyNode, IAddStrategyBuyNode } from '../../../../../modules/editor/nodes/shared/AddStrategyBuyNode'
import { StrategyApi } from '../../../../../modules/strategies/api'
import { LocalStorageKeys } from '../../../../../types'

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

  const addBuyStrategy: IAddStrategyBuyNode = {
    id: 'AddStrategyBuyNode',
    type: 'AddStrategyBuyNode',
    position: { x: 218, y: 450 },
    data: {
      parentId: strategyNode.id,
    },
    parentNode: 'Strategy',
  }

  // const strategyBuyNodes = strategy.strategyBuy.map({})

  return [strategyNode, addBuyStrategy]
}

const renderStrategyEdges = (nodes: Node[]): Edge[] => {
  return [
    {
      id: 'Strategy-AddStrategyBuyNode',
      type: 'default',
      source: 'Strategy',
      target: 'AddStrategyBuyNode',
    },
  ]
}

// Always first node Should be strategy node with strategy id
export default function Page({ params }: { params: { id: string } }) {
  const { value, set, remove } = useLocalStorageValue<Node[]>(LocalStorageKeys.StrategyCache)

  const [initialNodes, actions] = useAsync<Node[]>(async () => {
    const id = params?.id?.[0]
    // Return cached Nodes state => cached id must be equeal to params id, other ways it must be id of unsaved strategy
    if ((value && id && value[0].data?.strategy?._id === id) || (value && !value[0].data?.strategy?._id)) return value

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
        type: 'strategyNode',
        position: { x: 0, y: 0 },
        data: {},
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
