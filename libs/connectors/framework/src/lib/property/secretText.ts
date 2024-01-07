import { ValidationInputType } from '../validators/types'
import { PropertyValue, BaseProperty, PropertyType } from './base'

export type SecretTextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Text,ValidationInputType.STRING, R>
