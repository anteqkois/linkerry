export interface BalanceInfo {
  makerCommission: string
  takerCommission: string
  buyerCommission: string
  sellerCommission: string
  commissionRates: CommissionRates
  canTrade: boolean
  canWithdraw: boolean
  canDeposit: boolean
  brokered: boolean
  requireSelfTradePrevention: boolean
  preventSor: boolean
  updateTime: string
  accountType: string
  balances: Balance[]
  permissions: string[]
  uid: string
}

export interface CommissionRates {
  maker: string
  taker: string
  buyer: string
  seller: string
}

export interface Balance {
  asset: string
  free: string
  locked: string
}
