'use client'
import 'reactflow/dist/style.css'

import { useEffect, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, Controls, Node, ReactFlowProvider } from 'reactflow'
import { AddConditionNode } from './AddConditionNode'
import { useStrategiesStore } from './store'
import { StrategyBuyNode } from './StrategyBuyNode'

const nodeTypes = {
  strategyBuyNode: StrategyBuyNode,
  addConditionNode: AddConditionNode
 }

const initialNodes: Node[] = [
  {
    id: 'A',
    // type: 'group',
    type: 'strategyBuyNode',
    position: { x: 0, y: 0 },
    style: {
      // width: 500,
      // height: 250,
    },
    data: {},
  },
  {
    id: 'addConditionButton',
    type: 'addConditionNode',
    position: {
      x: 0,
      y: 0,
    },
    data: {},
    deletable: false,
    // draggable: false,
    parentNode: 'A',
    extent: 'parent',
    expandParent: true,
  },
  {
    id: 'addConditionButton2',
    type: 'addConditionNode',
    position: {
      x: 100,
      y: 100,
    },
    data: {},
    deletable: false,
    // draggable: false,
    parentNode: 'A',
    extent: 'parent',
    expandParent: true,
  },
]

export const Editor = () => {
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, onConnect } = useStrategiesStore()
  const reactFlowWrapper = useRef(null)

  useEffect(() => {
    // setup inital editor state
    setNodes(initialNodes)

    // TODO add some kind of guard to prevent lost state
    return () => {}
  }, [])

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh', border: '4px dotted black' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          maxZoom={1}
          defaultViewport={{ x: 1, y: 1, zoom: 0.1 }}
          // fitViewOptions={{
          //   padding: 1,
          // }}
        >
          <Controls />
          {/* <MiniMap /> */}
          <Background variant={BackgroundVariant.Dots} gap={15} size={0.6} className="bg-background-page" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
