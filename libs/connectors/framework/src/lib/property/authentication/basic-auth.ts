import { ValidationInputType } from '../../validators/types'
import { PropertyType, PropertyValue } from '../base'
import { BaseConnectorAuthSchema } from './base'

export type BasicAuthPropertyValue = {
  username: string
  password: string
}

export type BasicAuthPropertySchema = BaseConnectorAuthSchema<BasicAuthPropertyValue> & {
  username: {
    displayName: string
    description?: string
  }
  password: {
    displayName: string
    description?: string
  }
}

export type BasicAuthProperty = BasicAuthPropertySchema &
  PropertyValue<BasicAuthPropertyValue, PropertyType.BASIC_AUTH, ValidationInputType.ANY, true>
