import { Injectable } from '@nestjs/common'
import { CreateUserKeysDto } from './dto/create-user-keys.dto'
import { ExchangeCode, IUserKeys, IUserKeysResponse, Id } from '@market-connector/types'
import { InjectModel } from '@nestjs/mongoose'
import { UserKeys } from './schemas/user-keys.schema'
import { Model } from 'mongoose'
import { ConfigService } from '@nestjs/config'
import { CryptoService } from '../../lib/crypto'

@Injectable()
export class UserKeysService {
  constructor(
    private readonly configService: ConfigService,
    private readonly cryptoService: CryptoService,
    @InjectModel(UserKeys.name) private readonly userKeysModel: Model<UserKeys>,
  ) {}

  async createKeyPair(dto: CreateUserKeysDto, userId: Id): Promise<IUserKeysResponse> {
    const _kv = this.configService.get('USER_KEYS_KV')
    const s = this.configService.get(`USER_KEYS_S_${_kv}`)
    const rs = this.cryptoService.randomString()

    const _salt = s.split(';') + rs

    const aInfo = dto.aKey.slice(0, 5)
    const sInfo = dto.aKey.slice(0, 5)

    const { aKey, sKey, salt, kv, ...rest } = (
      await this.userKeysModel.create({
        user: userId,
        aKey: this.cryptoService.encryptKey(dto.aKey, _salt),
        aKeyInfo: aInfo,
        sKey: this.cryptoService.encryptKey(dto.sKey, _salt),
        sKeyInfo: sInfo,
        kv: _kv,
        exchange: dto.exchange,
        exchangeCode: dto.exchangeCode,
        name: dto.name,
        salt: rs,
      })
    ).toJSON()

    return { userKeys: rest }
  }

  async getKeyPairsInfo(userId: Id): Promise<IUserKeysResponse[]> {
    return this.userKeysModel.find(
      { user: userId },
      { _id: 1, aKeyInfo: 1, exchange: 1, exchangeCode: 1, name: 1, sKeyInfo: 1, user: 1 },
    )
  }

  async getKeyPair(exchangeCode: ExchangeCode, userId: Id): Promise<IUserKeys | null> {
    const keys = await this.userKeysModel.findOne({ user: userId, exchangeCode: exchangeCode })
    if (!keys) return null

    const _kv = this.configService.get('USER_KEYS_KV')
    const s = this.configService.get(`USER_KEYS_S_${_kv}`)

    return {
      ...keys.toJSON(),
      aKey: this.cryptoService.decryptKey(keys.aKey, s.split(';') + keys.salt),
      sKey: this.cryptoService.decryptKey(keys.sKey, s.split(';') + keys.salt),
    }
  }
}
