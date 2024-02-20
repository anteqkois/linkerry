import { AppConnectionWithoutSensitiveData } from '@linkerry/shared'
import { FetchQueryOptions } from '@tanstack/react-query'
import { AppConnectionsApi } from './api'

export const appConnectionsQueryConfig = {
  getMany: (): FetchQueryOptions<AppConnectionWithoutSensitiveData[]> => {
    return {
      queryKey: ['app-connections'],
      queryFn: async () => (await AppConnectionsApi.getMany()).data,
    }
  },
  // getOne: ({ connectorName, connectorVersion }: { connectorName: string, connectorVersion: string }): FetchQueryOptions<ConnectorMetadata> => {
  //   return {
  //     queryKey: [`connectors-metadata`, connectorName, connectorVersion],
  //     queryFn: async () => (await ConnectorsApi.getOne({ connectorName, connectorVersion })).data,
  //   }
  // },
}
