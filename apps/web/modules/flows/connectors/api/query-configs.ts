import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { FetchQueryOptions } from '@tanstack/react-query'
import { ConnectorsApi } from './api'

export const connectorsMetadataQueryConfig = {
  getSummaryMany: (): FetchQueryOptions<ConnectorMetadataSummary[]> => {
    return {
      queryKey: ['connectors-metadata', 'summary'],
      queryFn: async () => (await ConnectorsApi.getSummary()).data,
    }
  },
  getSummaryOne: ({ id }: { id: string }): FetchQueryOptions<ConnectorMetadataSummary> => {
    return {
      queryKey: [`connectors-metadata`, id, 'summary'],
      queryFn: async () => (await ConnectorsApi.getOneSummary(id)).data,
    }
  },
  getMany: (): FetchQueryOptions<ConnectorMetadata[]> => {
    return {
      queryKey: ['connectors-metadata'],
      queryFn: async () => (await ConnectorsApi.get()).data,
    }
  },
  getOne: ({ connectorName, connectorVersion }: { connectorName: string, connectorVersion: string }): FetchQueryOptions<ConnectorMetadata> => {
    return {
      queryKey: [`connectors-metadata`, connectorName, connectorVersion],
      queryFn: async () => (await ConnectorsApi.getOne({ connectorName, connectorVersion })).data,
    }
  },
}
