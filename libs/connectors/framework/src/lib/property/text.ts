import { BaseProperty, PropertyType, PropertyValue } from '.'

export type TextProperty<R extends boolean> = BaseProperty & PropertyValue<string, PropertyType.Text, R>
