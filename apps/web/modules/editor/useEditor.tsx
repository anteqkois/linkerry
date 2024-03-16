'use client'

import { create } from 'zustand'
import {
	createActionSlice,
	createEditorSlice,
	createFlowAndConnectorsSlice,
	createReactFlowSlice,
	createStepsSlice,
	createTriggersSlice,
	createWebSocketSlice,
} from './store'
import { EditorStore } from './store/types'

export const useEditor = create<EditorStore>((set, get) => ({
	...createActionSlice(set, get),
	...createEditorSlice(set, get),
	...createFlowAndConnectorsSlice(set, get),
	...createReactFlowSlice(set, get),
	...createStepsSlice(set, get),
	...createTriggersSlice(set, get),
	...createWebSocketSlice(set, get),
}))
