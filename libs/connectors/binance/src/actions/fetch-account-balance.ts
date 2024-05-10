import { getAccountBalanceActionFactory } from '@linkerry/common-exchanges'
import { binanceAuth } from '../common/auth'
import { BinanceClient } from '../common/client'

export const fetchAccountBalance = getAccountBalanceActionFactory(BinanceClient, binanceAuth)
