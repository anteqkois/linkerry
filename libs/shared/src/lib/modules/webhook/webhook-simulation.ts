import { Id, TimestampDatabase } from '../../common'

export interface WebhookSimulation extends TimestampDatabase {
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
