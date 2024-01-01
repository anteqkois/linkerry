import { ConnectorMetadata, ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { FetchQueryOptions } from '@tanstack/react-query'
import { ConnectorsMetadataApi } from './fetchers'

export const connectorsMetadataQueryConfig = {
  getSummaryMany: (): FetchQueryOptions<ConnectorMetadataSummary[]> => {
    return {
      queryKey: ['connectors-metadata:summary'],
      queryFn: async () => (await ConnectorsMetadataApi.getSummary()).data,
    }
  },
  getSummaryOne: ({ id }: { id: string }): FetchQueryOptions<ConnectorMetadataSummary> => {
    return {
      queryKey: [`connectors-metadata/${id}:summary`],
      queryFn: async () => (await ConnectorsMetadataApi.getOneSummary(id)).data,
    }
  },
  getMany: (): FetchQueryOptions<ConnectorMetadata[]> => {
    return {
      queryKey: ['connectors-metadata'],
      queryFn: async () => (await ConnectorsMetadataApi.get()).data,
    }
  },
  getOne: ({ id }: { id: string }): FetchQueryOptions<ConnectorMetadata> => {
    return {
      queryKey: [`connectors-metadata/${id}`],
      queryFn: async () => (await ConnectorsMetadataApi.getOne(id)).data,
    }
  },
}
