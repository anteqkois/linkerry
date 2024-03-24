import { CreateSlice, DynamicValueSlice } from './types'

export const createDynamicValueSlice: CreateSlice<DynamicValueSlice> = (set, get) => ({
	showDynamicValueModal: true,
	setShowDynamicValueModal: (newState: boolean) => {
		set({
			showDynamicValueModal: newState,
		})
	},
})
