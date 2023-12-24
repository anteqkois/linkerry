import { ConnectorMetadata } from '@market-connector/connectors-framework'
import { FetchQueryOptions, QueryClient, useQuery } from '@tanstack/react-query'
import { ConnectorsMetadataApi } from './api'

const connectorsMetadataQueryConfig: FetchQueryOptions<ConnectorMetadata[]> = {
  queryKey: ['connectors-metadata'],
  queryFn: async () => (await ConnectorsMetadataApi.get()).data,
}

export const useConnectorMetadataClientQuery = () => useQuery(connectorsMetadataQueryConfig)
export const useConnectorMetadataServerQuery = async () => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(connectorsMetadataQueryConfig)

  return {
    queryClient,
  }
}
