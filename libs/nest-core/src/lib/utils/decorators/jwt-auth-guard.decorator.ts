import { UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth'

export const UseJwtGuard = () => {
  return UseGuards(JwtAuthGuard)
}
