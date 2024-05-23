import { ValidationInputType } from '../../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from '../base'

export type JsonProperty<R extends boolean> = BaseProperty & PropertyValue<Record<string, unknown>, PropertyType.JSON, ValidationInputType.OBJECT, R>
