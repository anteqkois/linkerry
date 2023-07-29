import {
  AlertProviderType,
  ConditionOperatorType,
  ConditionTypeType,
  IConditionAlert,
} from '../libs/types/src'

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

export const alwaysExistingConditionAlert: IConditionAlert = {
  _id: '111111111111111111111111',
  active: true,
  name: 'Alwyas existing Condition',
  user: '000000000000000000000000',
  testMode: true,
  eventValidityUnix: 490382,
  isMarketProvider: false,
  operator: ConditionOperatorType.CROSSING,
  requiredValue: 1,
  triggeredTimes: 0,
  type: ConditionTypeType.ALERT,
  alert: {
    handlerUrl: `${process.env.ALERT_HANDLER_URL}/trading-view/111111111111111111111111`,
    messagePattern: '{"conditionId": "64b7ebc1f2e2233fc9d5540e", "ticker": "{{ticker}}", "close": "{{close}}"}',
    provider: AlertProviderType.TRADING_VIEW,
  },
}
