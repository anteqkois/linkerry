import { AppConnectionWithoutSensitiveData } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { AppConnectionsApi } from './api'

export const appConnectionsQueryConfig = {
  getMany: (): UseQueryOptions<AppConnectionWithoutSensitiveData[]> => {
    return {
      queryKey: ['app-connections'],
      queryFn: async () => (await AppConnectionsApi.getMany()).data,
    }
  },
  // getOne: ({ connectorName, connectorVersion }: { connectorName: string, connectorVersion: string }): UseQueryOptions<ConnectorMetadata> => {
  //   return {
  //     queryKey: [`connectors-metadata`, connectorName, connectorVersion],
  //     queryFn: async () => (await ConnectorsApi.getOne({ connectorName, connectorVersion })).data,
  //   }
  // },
}
