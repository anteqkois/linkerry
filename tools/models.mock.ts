// import { Alert, AlertProvidersType } from "@market-connector/core"
import mongoose, { ObjectId } from "mongoose"

export const testAuthUser = {
  consents: {
    test1: true,
    test2: true,
  },
  email: 'anteq@gmail.com',
  language: 'Polish',
  name: 'anteq',
  password: 'antekkoisA',
}

export const alwaysExistingUser = {
  _id: '000000000000000000000000',
  consents: {
    test1: true,
    test2: true,
  },
  email: 'anteqqois.login@gmail.com',
  language: 'Polish',
  name: 'anteqkois',
  password: 'antekkoisA',
  encryptedPassword: '$2b$10$2SpfVPkBcknXuHPe1GbqMO1KPrmya6DCQ1prYAr3.lEfp2CfVF6Oa',
}

// export const alwaysExistingAlert: Omit<Alert, 'userId' | 'conditionId'> & { userId: string, conditionId: string } = {
export const alwaysExistingAlert = {
  _id: '111111111111111111111111',
  active: true,
  alertHandlerUrl: `${ process.env.ALERT_HANDLER_URL }/trading-view/111111111111111111111111`,
  name: 'Alwyas existing Alert',
  userId: '000000000000000000000000',
  conditionId: '000000000000000000000000',
  alertValidityUnix: 389721,
  alertProvider: 'tradingView',
  ticker: 'BTC',
  testMode: true,
  messagePattern: "{\"alertId\": \"64b7ebc1f2e2233fc9d5540e\", \"ticker\": \"{{ticker}}\", \"close\": \"{{close}}\"}"
}
