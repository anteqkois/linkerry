'use client'
import 'reactflow/dist/style.css'

import { useEffect, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, Edge, ReactFlowProvider } from 'reactflow'
import { Drawer } from '../../shared/components/drawer/Index'
import { SelectTrigger } from './components/drawers/SelectTrigger'
import { CustomNode } from './nodes'
import { useEditor } from './useEditor'

interface EditorProps {
  limits: undefined // How many strategies buy can be etc.
  mode: 'demo' | 'production'
  nodeTypes: Record<string, (...props: any) => JSX.Element>
  initalData: {
    nodes: CustomNode[]
    edges: Edge[]
  }
  cache: {
    saveState: undefined
  }
}

export const Editor = ({ initalData, nodeTypes }: EditorProps) => {
  const {
    nodes,
    setNodes,
    onNodesChange,
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    setFlowId: setStrategyId,
    showDrawer,
    setShowDrawer,
    drawer
  } = useEditor()
  const reactFlowWrapper = useRef(null)

  useEffect(() => {
    // setup inital editor state
    setNodes(initalData.nodes)

    setStrategyId(initalData.nodes[0]?.id)
    // TODO add some kind of guard to prevent lost state
    // return () => {}
  }, [initalData.nodes])

  useEffect(() => {
    // setup inital editor state
    setEdges(initalData.edges)
    // return () => {}
  }, [initalData.edges])

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh', border: '4px dotted black' }} ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          // TODO add saving to cache when nodes/edges changed
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          maxZoom={1}
          defaultViewport={{ x: 1, y: 1, zoom: 0.1 }}
        >
          {/* <Controls /> */}
          {/* <MiniMap /> */}
          <Background variant={BackgroundVariant.Dots} gap={15} size={0.6} className="bg-background-page" />
        </ReactFlow>
      </div>
      <Drawer show={showDrawer} setShow={setShowDrawer} title={drawer.title} >
        <SelectTrigger />
      </Drawer>
    </ReactFlowProvider>
  )
}
