import { JWTPrincipalType } from '@linkerry/shared'
import { ExecutionContext, UnprocessableEntityException, createParamDecorator } from '@nestjs/common'
import { SocketClientDecorated } from '../../../../lib/nest-utils/websocket/types'

export const WebsocketJwtUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  const handshake = context.switchToWs().getClient<SocketClientDecorated>().handshake

  if (handshake.user.type !== JWTPrincipalType.CUSTOMER) throw new UnprocessableEntityException(`Invalid credentials`)

  return handshake.user
})
