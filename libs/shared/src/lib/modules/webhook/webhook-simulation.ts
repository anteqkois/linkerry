import { DatabaseTimestamp, Id } from '../../common'

export interface WebhookSimulation extends DatabaseTimestamp {
	_id: Id
	flowId: Id
	projectId: Id
}

export interface GetWebhookSimulationQuery {
	flowId: Id
}

export interface CreateWebhookSimulationInput {
	flowId: Id
}

export interface DeleteWebhookSimulationInput {
	flowId: Id
}
