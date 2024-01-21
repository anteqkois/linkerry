import { ValidationInputType } from '../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from './base'

export type TextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.TEXT,ValidationInputType.STRING, R>
