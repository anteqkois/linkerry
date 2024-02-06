import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { ConnectorsGetOptionsInput, ConnectorsMetadataGetManyQuery, Id } from '@linkerry/shared'
import { apiClient } from '../../../../libs/api-client'

export class ConnectorsApi {
	static async getSummary(query?: ConnectorsMetadataGetManyQuery) {
		return apiClient.get<ConnectorMetadataSummary[]>(`/connectors`, {
			params: { ...query, summary: true },
			paramsSerializer: {
				indexes: null, // no brackets at all
			},
		})
	}

	static async getOneSummary(id: Id) {
		return apiClient.get<ConnectorMetadataSummary>(`/connectors/${id}`, { params: { summary: true } })
	}

	static async get(query?: ConnectorsMetadataGetManyQuery) {
		return apiClient.get<ConnectorMetadata[]>(`/connectors`, {
			params: { ...query, summary: false },
			paramsSerializer: {
				indexes: null, // no brackets at all
			},
		})
	}

	static async getOne({ connectorName, connectorVersion }: { connectorName: string; connectorVersion: string }) {
		return apiClient.get<ConnectorMetadata>(`/connectors/${encodeURIComponent(connectorName)}`, {
			params: { summary: false, version: connectorVersion },
		})
	}

	static async getOptions(body: ConnectorsGetOptionsInput) {
		return apiClient.post<ConnectorMetadata>(`/connectors/options`, body)
	}
}
