import { Module } from '@nestjs/common'
import { UserKeysService } from './user-keys.service'
import { UserKeysController } from './user-keys.controller'
import { CryptoModule } from '../../lib/crypto'
import { MongooseModule } from '@nestjs/mongoose'
import { userKeysModelFactory } from './schemas/user-keys.schema'

@Module({
  imports: [CryptoModule, MongooseModule.forFeatureAsync([userKeysModelFactory])],
  controllers: [UserKeysController],
  providers: [UserKeysService],
})
export class UserKeysModule {}
