import { QueryClient, UseQueryOptions, useQuery } from '@tanstack/react-query'

export const useClientQuery = <T>(config: UseQueryOptions<T>) => useQuery({ ...config, retry: 2 })

let clientQueryClient: QueryClient
export const getBrowserQueryCllient = () => {
  if (clientQueryClient) return clientQueryClient
  clientQueryClient = new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        // staleTime: 2 * 60 * 1000,
        staleTime: 0,
      },
    },
  })
  return clientQueryClient
}

export const useServerQuery = async (config: UseQueryOptions<any>) => {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery(config)

  return {
    queryClient,
  }
}
