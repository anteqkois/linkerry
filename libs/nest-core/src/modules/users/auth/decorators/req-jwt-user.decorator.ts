import { JWTPrincipalType, JwtTokenPayload } from '@linkerry/shared'
import { ExecutionContext, UnprocessableEntityException, createParamDecorator } from '@nestjs/common'

export const ReqJwtUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<{ user: JwtTokenPayload }>()

	if (request.user.type !== JWTPrincipalType.CUSTOMER)
		throw new UnprocessableEntityException(`JWT type invalid, expect ${JWTPrincipalType.CUSTOMER}, receive: ${request.user.type}`)

	return request.user
})
