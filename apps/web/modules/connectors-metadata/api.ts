import { ConnectorMetadata } from '@market-connector/connectors-framework'
import { ConnectorsMetadataQuery, Id } from '@market-connector/shared'
import { apiClient } from '../../libs/api-client'

export class ConnectorsMetadataApi {
  static async get(query?: ConnectorsMetadataQuery) {
    return apiClient.get<ConnectorMetadata[]>(`/connectors-metadata`, {
      params: query,
      paramsSerializer: {
        indexes: null, // no brackets at all
      },
    })
  }

  static async getOne(id: Id) {
    return apiClient.get<ConnectorMetadata>(`/connectors-metadata/${id}`)
  }
}
