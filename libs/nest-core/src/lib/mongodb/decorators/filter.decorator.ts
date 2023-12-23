import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { FilterQuery } from 'mongoose'

export type MongoFilter<M> = FilterQuery<M>

export const QueryToMongoFilter = createParamDecorator(<M>(mappers: Record<string, string>, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest() as FastifyRequest
  // todo implement mappers. To have ability to change query keys
  const filter: FilterQuery<any> = {}

  for (const [key, value] of Object.entries(request.query as Record<string, string>)) {
    filter[key as keyof FilterQuery<M>] = {
      $regex: new RegExp(value, 'i'),
    }
  }
  return filter
})
