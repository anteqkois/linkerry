'use client'

import { ProductType } from '@linkerry/shared'
import { useClientQuery } from '../../../libs/react-query'
import { productsQueryConfig } from './query-configs'

export const useProducts = () => {
  const {
    data: plans,
    error: plansError,
    status: plansStatus,
  } = useClientQuery(
    productsQueryConfig.getManyWithPrices({
      include: ['price'],
      type: ProductType.PLAN,
    }),
  )

  return {
    plans,
    plansError,
    plansStatus,
  }
}
