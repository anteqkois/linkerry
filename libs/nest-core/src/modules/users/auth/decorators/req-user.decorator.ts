import { User } from '@linkerry/shared'
import { ExecutionContext, createParamDecorator } from '@nestjs/common'

export const ReqUser = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
	const request = ctx.switchToHttp().getRequest<{ user: User }>()
	return request.user
})
