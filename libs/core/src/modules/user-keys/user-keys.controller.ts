import { IUserKeys_CreateResponse, IUserKeys_GetManyResponse, JwtUser } from '@market-connector/types'
import { Body, Controller, Get, Post } from '@nestjs/common'
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator'
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator'
import { CreateUserKeysDto } from './dto/create-user-keys.dto'
import { UserKeysService } from './user-keys.service'

@Controller('user-keys')
export class UserKeysController {
  constructor(private readonly userKeysService: UserKeysService) {}

  @UseJwtGuard()
  @Get(':id')
  getKeyPair() {}

  @UseJwtGuard()
  @Get()
  async getKeyPairs(@ReqJwtUser() user: JwtUser): Promise<IUserKeys_GetManyResponse> {
    return { userKeys: await this.userKeysService.getKeyPairsInfo(user.id) }
  }

  @Post()
  @UseJwtGuard()
  createKeyPair(@ReqJwtUser() user: JwtUser, @Body() dto: CreateUserKeysDto): Promise<IUserKeys_CreateResponse> {
    return this.userKeysService.createKeyPair(dto, user.id)
  }
}
