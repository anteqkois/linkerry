import { JWTPrincipalType, JwtTokenPayload } from '@linkerry/shared'
import { ExecutionContext, UnprocessableEntityException, createParamDecorator } from '@nestjs/common'

export const ReqJwtWorker = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<{ user: JwtTokenPayload }>()

	if (request.user.type !== JWTPrincipalType.WORKER) throw new UnprocessableEntityException(`Invalid credentials`)

	return request.user
})
