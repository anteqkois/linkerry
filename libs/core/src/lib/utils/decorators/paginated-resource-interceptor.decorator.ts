import { UseInterceptors } from '@nestjs/common'
import { PaginatedResourceInterceptor } from '../interceptors/resource-pagination.interceptor'

export const UsePaginatedResourceInterceptor = () => {
  const paginatedResourceInterceptor = new PaginatedResourceInterceptor()
  return UseInterceptors(paginatedResourceInterceptor)
}
