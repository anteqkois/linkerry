import { ExchangesApi } from './api'

export const useExchanges = () => {
  const getExchanges = async () => {
    return ExchangesApi.get()
  }

  return { getExchanges }
}
