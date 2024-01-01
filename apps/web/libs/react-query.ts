import { FetchQueryOptions, QueryClient, useQuery } from '@tanstack/react-query'

export const useClientQuery = <T>(config: FetchQueryOptions<T>) => useQuery({ ...config, retry: 2 })
export const useServerQuery = async (config: FetchQueryOptions<any>) => {
	const queryClient = new QueryClient()
	await queryClient.prefetchQuery(config)

	return {
		queryClient,
	}
}
