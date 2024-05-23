import { OAuth2AppEncrypted } from '@linkerry/shared'
import { UseQueryOptions } from '@tanstack/react-query'
import { OAuth2Api } from './api'

export const OAuth2AppsQueryConfig = {
  getManyApps: (): UseQueryOptions<Omit<OAuth2AppEncrypted, 'clientSecret'>[]> => {
    return {
      queryKey: ['oauth2'],
      queryFn: async () => (await OAuth2Api.getManyApps()).data,
    }
  },
}
