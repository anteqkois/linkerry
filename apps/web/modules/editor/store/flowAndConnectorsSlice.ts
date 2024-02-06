import { CustomError, Flow, FlowState, FlowStatus, Id } from "@linkerry/shared";
import { FlowApi } from "../../flows";
import { CreateSlice, FlowAndConnectorsSlice } from "./types";


const emptyFlow: Flow = {
	_id: '1234567890',
	status: FlowStatus.Unpublished,
	user: '1234567890',
	version: {
		_id: '123456789',
		user: '1234567890',
		displayName: 'Untitled',
		state: FlowState.Draft,
		flow: '1234567890',
		valid: false,
		stepsCount: 1,
		triggers: [],
		actions: [],
	},
}


export const createFlowAndConnectorsSlice: CreateSlice<FlowAndConnectorsSlice> = (set, get) => ({
	// FLOW
	flow: emptyFlow,
	loadFlow: async (id: Id) => {
		let flow: string | Flow | null = localStorage.getItem('flow')
		if (flow) {
			flow = JSON.parse(flow) as Flow
		} else {
			const { data } = await FlowApi.get(id)
			flow = data
			localStorage.setItem('flow', JSON.stringify(flow))
		}

		if (!flow) throw new CustomError('Can not retrive flow')

		set({ flow })
		return flow
	},
	setFlow: (flow: Flow) => {
		set({ flow })
		localStorage.setItem('flow', JSON.stringify(flow))
	},
	// CONNECTORS
	testConnectorLoading: false,
})
