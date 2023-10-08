'use client'

import { IStrategyExpand } from '@market-connector/types'
import { useAsync, useLocalStorageValue } from '@react-hookz/web'
import { useEffect } from 'react'
import { Edge } from 'reactflow'
import {
  ConditionNode,
  CustomNode,
  CustomNodeType,
  Editor,
  IStrategyNode,
  StrategyBuyNode,
  StrategyNode,
} from '../../../../../modules/editor'
import { defaultEdgeFactory } from '../../../../../modules/editor/edges/edgesFactory'
import { AddNode } from '../../../../../modules/editor/nodes/components/AddNode'
import {
  addNodeFactory,
  nodeConfigs,
  strategyBuyNodeFactory,
  strategyNodeFactory,
} from '../../../../../modules/editor/nodes/components/nodeFactory'
import { StrategyApi } from '../../../../../modules/strategies/api'
import { LocalStorageKeys } from '../../../../../types'

const nodeTypes = {
  StrategyNode: StrategyNode,
  StrategyBuyNode: StrategyBuyNode,
  ConditionNode: ConditionNode,
  AddNode: AddNode,
}

const renderStrategyNodes = (strategy: IStrategyExpand<'strategyBuy.strategyBuy'>) => {
  const nodes: CustomNode[] = []
  const edges: Edge[] = []

  const strategyNode: IStrategyNode = strategyNodeFactory({ strategy })
  nodes.push(strategyNode)

  // Add AddNode if no Strategy Buy or render Strategy Buy and their edges
  if (!strategy.strategyBuy.length) {
    const AddNode = addNodeFactory({
      parentNodeId: strategyNode.id,
      x: nodeConfigs.StrategyNode.width + nodeConfigs.gap.x,
      y: nodeConfigs.StrategyNode.height + nodeConfigs.gap.y,
      variant: CustomNodeType.StrategyBuyNode,
      text: 'Strategy Buy',
    })
    nodes.push(AddNode)

    edges.push(
      defaultEdgeFactory({
        sourceNodeId: strategyNode.id,
        targetNodeId: AddNode.id,
      }),
    )
  } else {
    let yOffset = nodeConfigs.StrategyNode.height + nodeConfigs.gap.y
    let lastNode: CustomNode = strategyNode
    let index = 0
    for (const sb of strategy.strategyBuy) {
      // Add custom group node with border and title
      const strategyBuyNode = strategyBuyNodeFactory({
        parentNode: strategyNode.id,
        strategyBuy: sb,
        x: nodeConfigs.StrategyNode.width / 2 + nodeConfigs.gap.x,
        y: yOffset,
      })
      yOffset += nodeConfigs.StrategyBuyNode.height + nodeConfigs.gap.y
      index++
      nodes.push(strategyBuyNode)

      // Add Edge
      edges.push(
        defaultEdgeFactory({
          sourceNodeId: lastNode.id,
          targetNodeId: strategyBuyNode.id,
        }),
      )
      lastNode = strategyBuyNode

      // TODO Generate Conditions !
      if (index === strategy.strategyBuy.length) {
        // Add Add Node
        const AddNode = addNodeFactory({
          parentNodeId: lastNode.id,
          x: nodeConfigs.StrategyBuyNode.width,
          y: nodeConfigs.StrategyBuyNode.height + nodeConfigs.gap.y,
          variant: CustomNodeType.ConditionNode,
          text: 'Condition',
        })
        nodes.push(AddNode)

        edges.push(
          defaultEdgeFactory({
            sourceNodeId: lastNode.id,
            targetNodeId: AddNode.id,
          }),
        )
      }
    }
  }

  return { nodes, edges }
}

// Always first node Should be strategy node with strategy id
export default function Page({ params }: { params: { id: string } }) {
  const { value, remove } = useLocalStorageValue<CustomNode[]>(LocalStorageKeys.StrategyCache)

  const [initialData, actions] = useAsync<{ initialNodes: CustomNode[]; initialEdges: Edge[] }>(async () => {
    // Id from url
    const id = params?.id?.[0]

    // Return cached Nodes state => cached id must be equeal to params id, other ways it must be id of unsaved strategy
    if (
      (value && id && value[0].type === 'StrategyNode' && value[0].data?.strategy?._id === id) ||
      (value && value[0].type === 'StrategyNode' && !value[0].data?.strategy?._id)
    )
      return { initialNodes: value, initialEdges: [] }

    if (id) {
      // Fetch and render if exists
      const { data } = await StrategyApi.get(id, {
        expand: ['strategyBuy.strategyBuy'],
      })
      if (data && data._id === id) {
        const { nodes, edges } = renderStrategyNodes(data)
        // set(nodes)
        return { initialNodes: nodes, initialEdges: edges }
      }
    }

    // Create new strategy
    return {
      initialNodes: [strategyNodeFactory({})],
      initialEdges: [],
    }
  })

  useEffect(() => {
    actions.execute()
    // Clean cache
    return remove()
  }, [actions, remove])

  return (
    <Editor
      initalData={{ edges: initialData.result?.initialEdges ?? [], nodes: initialData.result?.initialNodes ?? [] }}
      nodeTypes={nodeTypes}
      mode="production"
      limits={undefined}
      cache={{ saveState: undefined }}
    />
  )
}
