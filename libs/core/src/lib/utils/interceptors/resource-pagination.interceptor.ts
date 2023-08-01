import { IResourceResponse } from '@market-connector/types'
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { PaginationDto } from '../dto/pagination.dto'

@Injectable()
export class PaginatedResourceInterceptor<T> implements NestInterceptor<T, IResourceResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<IResourceResponse<T>> {
    const { getRequest } = context.switchToHttp()
    const req = getRequest<{ query: Partial<PaginationDto> }>()
    const offset = +(req.query?.offset ?? 0)
    const limit = +(req.query?.limit ?? 250)

    return next.handle().pipe(
      map((data: any) => {
        const count = data[Object.keys(data)[0]].length
        return {
          hasNext: count === limit,
          data,
          offset,
          count,
        }
      }),
    )
  }
}
