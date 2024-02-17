import { ValidationInputType } from '../../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from '../base'

export type CheckboxProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<boolean, PropertyType.CHECKBOX, ValidationInputType.ANY, R>
