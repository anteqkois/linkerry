import { assertNotNullOrUndefined } from '@linkerry/shared'
import { SetStateAction } from 'react'
import { EditorDrawer } from '../types'
import { CreateSlice, EditorSlice } from './types'

export const editorDrawers: EditorDrawer[] = [
	{
		name: 'select_trigger',
		title: 'Select Trigger',
	},
	{
		name: 'trigger_connector',
		title: 'Trigger',
	},
	{
		name: 'select_action',
		title: 'Select Action',
	},
	{
		name: 'action_connector',
		title: 'Action',
	},
	{
		name: 'flow_runs_list',
		title: 'Flow Runs',
	},
	{
		name: 'flow_run',
		title: 'Flow Run',
	},
]

export const createEditorSlice: CreateSlice<EditorSlice> = (set, get) => ({
	isLoading: false,
	setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
	// TODO refactor to use useContext and store drwer state in defined for this Components with Provider
	showRightDrawer: false,
	setShowRightDrawer: (value: SetStateAction<boolean>) => {
		if (typeof value === 'function') set((state) => ({ showRightDrawer: value(state.showRightDrawer) }))
		else set((state) => ({ showRightDrawer: value }))
	},
	rightDrawer: editorDrawers[0],
	setRightDrawer: (name: EditorDrawer['name']) => {
		const newDrawer = editorDrawers.find((rightDrawer) => rightDrawer.name === name)
		assertNotNullOrUndefined(newDrawer, 'newDrawer')
		if (newDrawer?.name === get().rightDrawer.name) return
		set(() => ({ rightDrawer: newDrawer }))
	},
	showLeftDrawer: false,
	setShowLeftDrawer: (value: SetStateAction<boolean>) => {
		if (typeof value === 'function') set((state) => ({ showLeftDrawer: value(state.showLeftDrawer) }))
		else set((state) => ({ showLeftDrawer: value }))
	},
	leftDrawer: editorDrawers[0],
	setLeftDrawer: (name: EditorDrawer['name']) => {
		const newDrawer = editorDrawers.find((leftDrawer) => leftDrawer.name === name)
		assertNotNullOrUndefined(newDrawer, 'newDrawer')
		if (newDrawer?.name === get().leftDrawer.name) return
		set(() => ({ leftDrawer: newDrawer }))
	},
})
