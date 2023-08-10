'use client'
import 'reactflow/dist/style.css'

import { useEffect, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, Controls, Edge, Node, ReactFlowProvider } from 'reactflow'
import { useEditor } from './store'

interface EditorProps {
  limits: undefined // How many strategies buy can be etc.
  mode: 'demo' | 'production'
  nodeTypes: Record<string, (...props: any) => JSX.Element>
  initalData: {
    nodes: Node[]
    edges: Edge[]
  }
  cache: {
    saveState: undefined
    restoreState: undefined
  }
}

export const Editor = ({ initalData, nodeTypes }: EditorProps) => {
  const { nodes, setNodes, onNodesChange, edges, setEdges, onEdgesChange, onConnect } = useEditor()
  const reactFlowWrapper = useRef(null)

  useEffect(() => {
    // setup inital editor state
    setNodes(initalData.nodes)
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
