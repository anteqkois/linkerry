import { exchangeAuth } from '@linkerry/common-exchanges'
import { BinanceClient } from './client'

const authDescription = `
Follow this **[Binance tutorial link](https://www.binance.com/en/support/faq/how-to-create-api-keys-on-binance-360002502072)** to get API Keys for
your account, then fill below form. Set **IP access restrictions** to "Unrestricted" (our flows runs on multiple servers). Remember  to unlock the restrictions that you will use. So if you want to trade, unlock **Enable Spot & Margin Trading** and similarly for other options.
`

export const binanceAuth = exchangeAuth(BinanceClient, authDescription)
