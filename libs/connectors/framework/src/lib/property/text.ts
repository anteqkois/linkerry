import { BaseProperty, PropertyValue } from '.'
import { PropertyType } from './base'

export type TextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Text, R>
