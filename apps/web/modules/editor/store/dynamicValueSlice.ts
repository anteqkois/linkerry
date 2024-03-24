import { CreateSlice, DynamicValueSlice } from './types'

export const createDynamicValueSlice: CreateSlice<DynamicValueSlice> = (set, get) => ({
	showDynamicValueModal: false,
	onSelectDynamicValueCallback: null,
	setShowDynamicValueModal: (newState: boolean, onSelectDynamicValueCallback?: (tokenString: string, data: any) => void) => {
		set({
			showDynamicValueModal: newState,
			onSelectDynamicValueCallback: onSelectDynamicValueCallback ?? null,
		})
	},
})
