import { UseGuards } from '@nestjs/common'
import { JwtCookiesAuthGuard } from '../../auth'

export const UseJwtGuard = () => {
  return UseGuards(JwtCookiesAuthGuard)
}
