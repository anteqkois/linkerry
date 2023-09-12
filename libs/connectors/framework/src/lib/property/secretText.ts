import { BaseProperty, PropertyValue } from '.'
import { PropertyType } from './base'

export type SecretTextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.Text, R>
