import { JwtTokenPayload } from '@linkerry/shared'
import { Socket } from 'socket.io'

export interface SocketClientDecorated extends Socket {
  handshake: Socket['handshake'] & {
    user: JwtTokenPayload
  }
}
