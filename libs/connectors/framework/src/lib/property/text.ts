import { BaseProperty, PropertyType, PropertyValue } from '.'

export type TextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Text, R>
