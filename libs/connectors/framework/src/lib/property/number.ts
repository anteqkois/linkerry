import { ValidationInputType } from '../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from './base'

export type NumberProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<number, PropertyType.Number, ValidationInputType.NUMBER, R>
