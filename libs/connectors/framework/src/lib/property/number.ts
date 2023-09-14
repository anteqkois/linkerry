import { BaseProperty, PropertyValue } from '.'
import { PropertyType } from './base'

export type NumberProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Number, R>
