import { CreateSlice, DynamicValueSlice } from './types'

export const createDynamicValueSlice: CreateSlice<DynamicValueSlice> = (set, get) => ({
	showDynamicValueModal: false,
	setShowDynamicValueModal: (newState: boolean) => {
		set({
			showDynamicValueModal: newState,
		})
	},
})
