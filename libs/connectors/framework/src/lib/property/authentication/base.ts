import { BaseProperty } from '../base'

type ConnectorAuthValidatorParams<AuthValueSchema> = {
  auth: AuthValueSchema
}

export type ConnectorAuthValidatorResponse = { valid: true } | { valid: false; error: string }

export type BaseConnectorAuthSchema<AuthValueSchema> = BaseProperty & {
  validate?: (params: ConnectorAuthValidatorParams<AuthValueSchema>) => Promise<ConnectorAuthValidatorResponse>
}
