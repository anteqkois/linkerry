import { JWTPrincipalType, JwtTokenPayload, isNil } from '@linkerry/shared'
import { ExecutionContext, UnprocessableEntityException, createParamDecorator } from '@nestjs/common'

export const ReqJwtUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<{ user: JwtTokenPayload }>()

  if (request.user.type !== JWTPrincipalType.CUSTOMER) throw new UnprocessableEntityException(`Invalid credentials`)
  if (isNil(request.user.projectId)) throw new UnprocessableEntityException(`Missing projectId`)

  return request.user
})
