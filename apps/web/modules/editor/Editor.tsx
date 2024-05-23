'use client'
import 'reactflow/dist/style.css'

import { useEffect, useMemo, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow'
import { Drawer } from '../../shared/components/Drawer/Index'
import { Spinner } from '../../shared/components/Spinner'
import { ActionConnectorPanel } from './action/ActionConnectorPanel'
import { ActionNodeElement } from './action/ActionNode'
import { SelectActionPanel } from './action/SelectActionPanel'
import { TriggerNodeElement } from './common'
import { EditorFlowMenu } from './components'
import { TestFlowNodeElement } from './components/TestFlowNode'
import { FlowRunPanel } from './flow-runs/FlowRunPanel'
import { FlowRunsListPanel } from './flow-runs/FlowRunsListPanel'
import { SelectTriggerNodeElement } from './trigger/SelectTriggerNode'
import { SelectTriggerPanel } from './trigger/SelectTriggerPanel'
import { TriggerConnectorPanel } from './trigger/TriggerConnectorPanel'
import { EditorDrawer, EditorLimits } from './types'
import { useEditor } from './useEditor'

export const editorDrawers: Record<EditorDrawer['name'], () => JSX.Element> = {
  select_trigger: SelectTriggerPanel,
  trigger_connector: TriggerConnectorPanel,
  select_action: SelectActionPanel,
  action_connector: ActionConnectorPanel,
  flow_run: FlowRunPanel,
  flow_runs_list: FlowRunsListPanel,
  flow_testing: Spinner,
}

const nodeTypes = {
  SelectTriggerNode: SelectTriggerNodeElement,
  TriggerNode: TriggerNodeElement,
  ActionNode: ActionNodeElement,
  TestFlowNode: TestFlowNodeElement,
}

interface EditorProps {
  limits: EditorLimits
  mode: 'demo' | 'production'
  useLocalStorage?: boolean
  // nodeTypes: Record<string, (...props: any) => JSX.Element>
  cache: {
    saveState: undefined
  }
}

export const Editor = ({ mode, limits, useLocalStorage = false }: EditorProps) => {
  const {
    nodes,
    onNodesChange,
    edges,
    onEdgesChange,
    onConnect,
    showRightDrawer,
    setShowRightDrawer,
    rightDrawer,
    leftDrawer,
    flowLoaded,
    showLeftDrawer,
    setShowLeftDrawer,
    setLimits,
    rightDrawerCustomHeader,
  } = useEditor()
  const reactFlowWrapper = useRef(null)

  useEffect(() => {
    console.debug(`Editor mode: ${mode}`)
    setLimits(limits)
  }, [])

  const EditorRightDrawer = useMemo(() => editorDrawers[rightDrawer.name], [rightDrawer.name])
  const EditorLeftDrawer = useMemo(() => editorDrawers[leftDrawer.name], [leftDrawer.name])

  return (
    <ReactFlowProvider>
      {flowLoaded ? <EditorFlowMenu /> : null}
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
      <Drawer
        show={showRightDrawer}
        setShow={setShowRightDrawer}
        position="right"
        customHeader={rightDrawer.name === 'action_connector' || rightDrawer.name === 'trigger_connector' ? rightDrawerCustomHeader : undefined}
        title={rightDrawer.title}
      >
        <EditorRightDrawer />
      </Drawer>
      <Drawer show={showLeftDrawer} setShow={setShowLeftDrawer} position="left" title={leftDrawer.title}>
        <EditorLeftDrawer />
      </Drawer>
    </ReactFlowProvider>
  )
}
