import { PropertyValue, BaseProperty, PropertyType } from './base'

export type SecretTextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Text, R>
