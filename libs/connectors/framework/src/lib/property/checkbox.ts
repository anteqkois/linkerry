import { ValidationInputType } from '../validators/types'
import { PropertyValue, BaseProperty, PropertyType } from './base'

export type CheckboxProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<boolean, PropertyType.Checkbox, ValidationInputType.ANY, R>
