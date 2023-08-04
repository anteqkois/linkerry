import { Body, Controller, Get, Post } from '@nestjs/common'
import { UserKeysService } from './user-keys.service'
import { CreateUserKeysDto } from './dto/create-user-keys.dto'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { ExchangeCode, IUserKeysResponse, JwtUser } from '@market-connector/types'

@Controller('user-keys')
export class UserKeysController {
  constructor(private readonly userKeysService: UserKeysService) {}

  @UseJwtGuard()
  @Get(':id')
  getKeyPair() {}

  @UseJwtGuard()
  @Get()
  getKeyPairs() {}

  @Post()
  @UseJwtGuard()
  createKeyPair(@ReqJwtUser() user: JwtUser, @Body() dto: CreateUserKeysDto): Promise<IUserKeysResponse> {
    return this.userKeysService.createKeyPair(dto, user.id)
  }
}
