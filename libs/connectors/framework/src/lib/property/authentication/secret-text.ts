import { ValidationInputType } from '../../validators/types'
import { PropertyType, PropertyValue } from '../base'
import { BaseConnectorAuthSchema } from './base'

export type SecretTextProperty<R extends boolean = boolean> = BaseConnectorAuthSchema<string> &
  PropertyValue<string, PropertyType.SECRET_TEXT, ValidationInputType.STRING, R>
