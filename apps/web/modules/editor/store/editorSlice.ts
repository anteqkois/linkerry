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
]

export const createEditorSlice: CreateSlice<EditorSlice> = (set, get) => ({
	isLoading: false,
	setIsLoading: (value: boolean) => set((state) => ({ isLoading: value })),
	showDrawer: false,
	setShowDrawer: (value: SetStateAction<boolean>) => {
		if (typeof value === 'function') set((state) => ({ showDrawer: value(state.showDrawer) }))
		else set((state) => ({ showDrawer: value }))
	},
	drawer: editorDrawers[0],
	setDrawer: (name: EditorDrawer['name']) => {
		const newDrawer = editorDrawers.find((drawer) => drawer.name === name)
		if (newDrawer?.name === get().drawer.name) return
		set(() => ({ drawer: newDrawer }))
	},
})
