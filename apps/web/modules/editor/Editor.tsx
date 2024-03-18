'use client'
import 'reactflow/dist/style.css'

import { useEffect, useRef } from 'react'
import ReactFlow, { Background, BackgroundVariant, ReactFlowProvider } from 'reactflow'
import { Drawer } from '../../shared/components/Drawer/Index'
import { ActionConnectorPanel } from './action/ActionConnectorPanel'
import { ActionNodeElement } from './action/ActionNode'
import { SelectActionPanel } from './action/SelectActionPanel'
import { TriggerNodeElement } from './common'
import { EditorFlowMenu } from './components'
import { TestFlowNodeElement } from './components/TestFlowNode'
import { FlowRunsListPanel } from './flow-runs/FlowRunsListPanel'
import { SelectTriggerNodeElement } from './trigger/SelectTriggerNode'
import { SelectTriggerPanel } from './trigger/SelectTriggerPanel'
import { TriggerConnectorPanel } from './trigger/TriggerConnectorPanel'
import { EditorDrawer } from './types'
import { useEditor } from './useEditor'
import { FlowRunPanel } from './flow-runs/FlowRunPanel'

export const editorDrawers: Record<EditorDrawer['name'], () => JSX.Element> = {
	select_trigger: SelectTriggerPanel,
	trigger_connector: TriggerConnectorPanel,
	select_action: SelectActionPanel,
	action_connector: ActionConnectorPanel,
	flow_run: FlowRunPanel,
	flow_runs_list: FlowRunsListPanel,
}

const nodeTypes = {
	SelectTriggerNode: SelectTriggerNodeElement,
	TriggerNode: TriggerNodeElement,
	ActionNode: ActionNodeElement,
	TestFlowNode: TestFlowNodeElement,
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
		loaded,
		showLeftDrawer,
		setShowLeftDrawer,
	} = useEditor()
	const reactFlowWrapper = useRef(null)

	useEffect(() => {
		console.log(`Editor mode: ${mode}`)
	}, [])

	const EditorRightDrawer = editorDrawers[rightDrawer.name]
	const EditorLeftrawer = editorDrawers[leftDrawer.name]

	return (
		<ReactFlowProvider>
			{loaded ? <EditorFlowMenu /> : null}
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
			<Drawer show={showRightDrawer} setShow={setShowRightDrawer} position="right">
				<EditorRightDrawer />
			</Drawer>
			<Drawer show={showLeftDrawer} setShow={setShowLeftDrawer} position="left" title={leftDrawer.title}>
				<EditorLeftrawer />
			</Drawer>
		</ReactFlowProvider>
	)
}
