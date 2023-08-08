'use client'
import 'reactflow/dist/style.css'

import { useCallback, useEffect, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, Controls, Node, ReactFlowProvider } from 'reactflow'
import { AddConditionNode } from './AddConditionNode'
import { useStrategiesStore } from './store'

const nodeTypes = { addConditionNode: AddConditionNode }

const initialNodes: Node[] = [
  {
    id: 'addConditionButton',
    type: 'addConditionNode',
    position: {
      x: 0,
      y: 0,
    },
    data: {},
    deletable: false,
    draggable: false,
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
          <Background variant={BackgroundVariant.Dots} gap={15} size={1} className="bg-background-page" />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}
