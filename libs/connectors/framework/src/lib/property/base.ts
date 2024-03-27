import { TypedValidatorFn, ValidationInputType } from '../validators/types'

export enum PropertyType {
	TEXT = 'TEXT',
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
	// DateTime = "DateTime",
	// File = "File"
}

export type BaseProperty = {
	displayName: string
	description: string
}

export type Properties<T> = Omit<T, 'valueSchema' | 'type' | 'defaultValidators' | 'defaultProcessors'>

export type PropertyValue<S, T extends PropertyType, V extends ValidationInputType, R extends boolean> = {
	valueSchema: S
	type: T
	required: R
	defaultProcessors?: any[]
	processors?: any[]
	validators?: TypedValidatorFn<V>[]
	defaultValidators?: TypedValidatorFn<V>[]
	defaultValue?: T extends PropertyType.TEXT
		? string
		: T extends PropertyType.LONG_TEXT
		? string
		: T extends PropertyType.STATIC_DROPDOWN
		? unknown
		: T extends PropertyType.NUMBER
		? number
		: T extends PropertyType.SECRET_TEXT
		? string
		: T extends PropertyType.CHECKBOX
		? boolean
		: unknown
}
