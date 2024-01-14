import { ConnectorMetadata, ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { ConnectorsMetadataGetManyQuery, Id } from '@market-connector/shared'
import { apiClient } from '../../../libs/api-client'

export class ConnectorsMetadataApi {
  static async getSummary(query?: ConnectorsMetadataGetManyQuery) {
    return apiClient.get<ConnectorMetadataSummary[]>(`/connectors-metadata`, {
      params: { ...query, summary: true },
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
  }

  static async getOneSummary(id: Id) {
    return apiClient.get<ConnectorMetadataSummary>(`/connectors-metadata/${id}`, { params: { summary: true } })
  }

  static async get(query?: ConnectorsMetadataGetManyQuery) {
    return apiClient.get<ConnectorMetadata[]>(`/connectors-metadata`, {
      params: { ...query, summary: false },
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
  }

  static async getOne({connectorName, connectorVersion}:{ connectorName: string, connectorVersion: string }) {
    return apiClient.get<ConnectorMetadata>(`/connectors-metadata/${encodeURIComponent(connectorName)}`, { params: { summary: false, version: connectorVersion } })
  }
}
