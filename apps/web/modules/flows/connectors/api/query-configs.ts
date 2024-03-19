import { ConnectorMetadata, ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { UseQueryOptions } from '@tanstack/react-query'
import { ConnectorsApi } from './api'

export const connectorsMetadataQueryConfig = {
  getSummaryMany: (): UseQueryOptions<ConnectorMetadataSummary[]> => {
    return {
      queryKey: ['connectors-metadata', 'summary'],
      queryFn: async () => (await ConnectorsApi.getSummary()).data,
    }
  },
  getSummaryOne: ({ id }: { id: string }): UseQueryOptions<ConnectorMetadataSummary> => {
    return {
      queryKey: [`connectors-metadata`, id, 'summary'],
      queryFn: async () => (await ConnectorsApi.getOneSummary(id)).data,
    }
  },
  getMany: (): UseQueryOptions<ConnectorMetadata[]> => {
    return {
      queryKey: ['connectors-metadata'],
      queryFn: async () => (await ConnectorsApi.getMany()).data,
    }
  },
  getOne: ({ connectorName, connectorVersion }: { connectorName: string, connectorVersion: string }): UseQueryOptions<ConnectorMetadata> => {
    return {
      queryKey: [`connectors-metadata`, connectorName, connectorVersion],
      queryFn: async () => (await ConnectorsApi.getOne({ connectorName, connectorVersion })).data,
    }
  },
}
