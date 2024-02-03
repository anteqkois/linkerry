'use client'
import 'reactflow/dist/style.css'

import { useEffect, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow'
import { Drawer } from '../../shared/components/drawer/Index'
import { TriggerNodeElement } from './components'
import { SelectTriggerNodeElement } from './nodes/components/SelectTriggerNode'
import { SelectActionPanel } from './action/SelectActionPanel'
import { SelectTriggerPanel } from './trigger/SelectTriggerPanel'
import { TriggerConnectorPanel } from './trigger/TriggerConnectorPanel'
import { useEditor } from './useEditor'

export const editorDrawers = {
  select_trigger: SelectTriggerPanel,
  trigger_connector: TriggerConnectorPanel,
  select_action: SelectActionPanel,
  action: TriggerConnectorPanel,
}

const nodeTypes = {
  SelectTriggerNode: SelectTriggerNodeElement,
  TriggerNode: TriggerNodeElement,
}

interface EditorProps {
  limits: undefined // How many strategies buy can be etc.
  mode: 'demo' | 'production'
  // nodeTypes: Record<string, (...props: any) => JSX.Element>
  cache: {
    saveState: undefined
  }
}

export const Editor = ({ mode }: EditorProps) => {
  const { nodes, onNodesChange, edges, onEdgesChange, onConnect, showDrawer, setShowDrawer, drawer } = useEditor()
  const reactFlowWrapper = useRef(null)

  useEffect(() => {
    console.log(`Editor mode: ${mode}`)
  }, [])

  const EditorDrawer = editorDrawers[drawer.name]

  return (
    <ReactFlowProvider>
      <div style={{ width: '100vw', height: '100vh' }} ref={reactFlowWrapper}>
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
      <Drawer show={showDrawer} setShow={setShowDrawer}>
        <EditorDrawer />
      </Drawer>
    </ReactFlowProvider>
  )
}
