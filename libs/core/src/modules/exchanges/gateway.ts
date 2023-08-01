import { ExchangeCode, IMarket } from '@market-connector/types'
import { OnModuleInit } from '@nestjs/common'

export interface IOnRegisterInput {
  cron: { crontimeMarket: string; crontimeExchange: string; run: boolean }
}

export abstract class ExchangeGateway implements OnModuleInit {
  abstract getMarkets(filter: {
    code?: ExchangeCode
    symbol?: string
    base?: string
    quote?: string
  }): Promise<IMarket[] | []>
  abstract updateMarket(): void
  abstract onRegister(config: IOnRegisterInput): void
  abstract onModuleInit(): void
  abstract getMarket(filter: any): Promise<IMarket | null>
}
