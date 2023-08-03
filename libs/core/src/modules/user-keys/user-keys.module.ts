import { Module } from '@nestjs/common'
import { UserKeysService } from './user-keys.service'
import { UserKeysController } from './user-keys.controller'
import { CryptoModule } from '../../lib/crypto'

@Module({
  imports: [CryptoModule],
  controllers: [UserKeysController],
  providers: [UserKeysService],
})
export class UserKeysModule {}
