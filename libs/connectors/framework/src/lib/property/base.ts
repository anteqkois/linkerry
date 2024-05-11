import { ProcessorFn } from '../processors/types'
import { TypedValidatorFn, ValidationInputType } from '../validators/types'

export enum PropertyType {
  SHORT_TEXT = 'SHORT_TEXT',
  LONG_TEXT = 'LONG_TEXT',
  MARKDOWN = 'MARKDOWN',
  STATIC_DROPDOWN = 'STATIC_DROPDOWN',
  NUMBER = 'NUMBER',
  CHECKBOX = 'CHECKBOX',
  OAUTH2 = 'OAUTH2',
  SECRET_TEXT = 'SECRET_TEXT',
  ARRAY = 'ARRAY',
  OBJECT = 'OBJECT',
  BASIC_AUTH = 'BASIC_AUTH',
  JSON = 'JSON',
  // MultiSelectDropdown = 'MultiSelectDropdown',
  // StaticMultiSelectDropdown = 'StaticMultiSelectDropdown',
  DYNAMIC_DROPDOWN = 'DYNAMIC_DROPDOWN',
  DYNAMIC = 'DYNAMIC',
  CUSTOM_AUTH = 'CUSTOM_AUTH',
  DATE_TIME = 'DATE_TIME',
  // File = "File"
}

export type BaseProperty = {
  displayName: string
  description?: string
}

export type Properties<T> = Omit<T, 'valueSchema' | 'type' | 'defaultValidators' | 'defaultProcessors'>

export type PropertyValue<S, T extends PropertyType, V extends ValidationInputType, REQUIRED extends boolean> = {
  valueSchema: S
  type: T
  required: REQUIRED
  defaultProcessors?: ProcessorFn[]
  processors?: ProcessorFn[]
  validators?: TypedValidatorFn<V>[]
  defaultValidators?: TypedValidatorFn<V>[]
  defaultValue?: T extends PropertyType.ARRAY
    ? unknown[]
    : T extends PropertyType.JSON
    ? object
    : T extends PropertyType.CHECKBOX
    ? boolean
    : T extends PropertyType.LONG_TEXT
    ? string
    : T extends PropertyType.SHORT_TEXT
    ? string
    : T extends PropertyType.NUMBER
    ? number
    : T extends PropertyType.DYNAMIC_DROPDOWN
    ? unknown
    : // : T extends PropertyType.MULTI_SELECT_DROPDOWN
    // ? unknown[]
    // : T extends PropertyType.STATIC_MULTI_SELECT_DROPDOWN
    // ? unknown[]
    T extends PropertyType.STATIC_DROPDOWN
    ? unknown
    : T extends PropertyType.DATE_TIME
    ? string
    : // : T extends PropertyType.FILE
      // ? ApFile
      unknown
}
