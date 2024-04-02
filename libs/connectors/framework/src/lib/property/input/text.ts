import { ValidationInputType } from '../../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from '../base'

export type ShortTextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.SHORT_TEXT,ValidationInputType.STRING, R>

export type LongTextProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<string, PropertyType.LONG_TEXT,ValidationInputType.STRING, R>
