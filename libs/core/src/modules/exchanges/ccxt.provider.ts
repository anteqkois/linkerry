import { ExchangeCode, IExchange, IMarket, ITimeFrame, MarketType, TimeFrameCode } from '@market-connector/types'
import ccxt, { Dictionary, Exchange, exchanges } from 'ccxt'

// @Injectable()
export class CcxtProvider {
  exchangeCode: keyof typeof exchanges
  // exchangeCode: ExchangeCode
  restClient: Exchange
  // proClient:any

  // public constructor(exchange: keyof typeof exchanges) {
  //   this.name = exchange
  //   this.restClient = new ccxt[exchange]()
  // }
  init(exchange: keyof typeof exchanges) {
    this.exchangeCode = exchange
    this.restClient = new ccxt[exchange]()
  }

  async getMarkets(): Promise<IMarket[]> {
    await this.restClient.loadMarkets()
    const markets = await this.restClient.fetchMarkets()
    const parsedMarets: IMarket[] = []

    for (let market of markets) {
      // const parsedMarket = this.restClient.parseMarket(market)
      parsedMarets.push({
        active: market.active ?? true,
        code: market.id,
        exchangeCode: ExchangeCode[this.exchangeCode],
        symbol: market.symbol,
        base: market.base,
        quote: market.quote,
        baseId: market.baseId,
        quoteId: market.quoteId,
        type: (market.type as MarketType) ?? MarketType.spot,
        spot: market.spot ?? false,
        margin: market.margin ?? false,
        future: market.future ?? false,
        swap: market.swap ?? false,
        option: market.option ?? false,
      })
    }

    return parsedMarets
  }

  async getExchangeInfo(): Promise<IExchange> {
    await this.restClient.loadMarkets()

    const timeFrames: ITimeFrame[] = []

    for (const timeFrame in this.restClient.timeframes) {
      if (Object.prototype.hasOwnProperty.call(this.restClient.timeframes, timeFrame)) {
        const code = TimeFrameCode[timeFrame as TimeFrameCode]

        if (!code) continue
        timeFrames.push({
          code,
          value: this.restClient.timeframes[timeFrame],
        })
      }
    }

    return {
      code: ExchangeCode[this.exchangeCode],
      name: this.restClient.name,
      rateLimit: this.restClient.rateLimit,
      symbols: this.restClient.symbols,
      timeframes: timeFrames,
      timeout: this.restClient.timeout,
      urls: {
        fees: this.restClient.urls.fees,
        logo: this.restClient.urls.logo,
        www: this.restClient.urls.www,
      },
      version: this.restClient.version,
    }
  }
}
