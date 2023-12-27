import { BaseProperty, PropertyType, PropertyValue } from './base'

export type TextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Text, R>
