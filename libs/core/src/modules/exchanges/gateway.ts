import { IMarket } from '@market-connector/types'
import { OnModuleInit } from '@nestjs/common'

export abstract class ExchangeGateway implements OnModuleInit {
  // abstract getDetails(): Promise<IExchange>
  abstract getMarkets(): Promise<IMarket[]>
  abstract updateMarket(): void
  abstract registerCronJobs(): void
  abstract onModuleInit(): void
  // abstract getMarket(): Promise<IMarket>
}
