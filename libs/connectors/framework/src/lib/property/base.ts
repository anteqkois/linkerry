import { TypedValidatorFn, ValidationInputType } from '../validators/types'

export enum PropertyType {
	TEXT = 'TEXT',
	LONG_TEXT = 'LONG_TEXT',
	MARKDOWN = 'MARKDOWN',
	STATIC_DROPDOWN = 'STATIC_DROPDOWN',
	NUMBER = 'NUMBER',
	CHECKBOX = 'CHECKBOX',
	// OAUTH_2 = 'OAuth2',
	SECRET_TEXT = 'SECRET_TEXT',
	// Array = 'Array',
	// Object = 'Object',
	BASIC_AUTH = 'BASIC_AUTH',
	// JSON = 'JSON',
	// MultiSelectDropdown = 'MultiSelectDropdown',
	// StaticMultiSelectDropdown = 'StaticMultiSelectDropdown',
	DYNAMIC_DROPDOWN = 'DYNAMIC_DROPDOWN',
	DYNAMIC = "DYNAMIC",
	CUSTOM_AUTH = 'CUSTOM_AUTH',
	// DateTime = "DateTime",
	// File = "File"
}

export type BaseProperty = {
	name: string
	displayName: string
	description: string
}

type ConnectorAuthValidatorParams<AuthValueSchema> = {
	auth: AuthValueSchema
}

export type ConnectorAuthValidatorResponse = { valid: true } | { valid: false; error: string }

export type BaseConnectorAuthSchema<AuthValueSchema> = BaseProperty & {
	validate?: (params: ConnectorAuthValidatorParams<AuthValueSchema>) => Promise<ConnectorAuthValidatorResponse>
}

// export type TPropertyValue<T, U extends PropertyType, VALIDATION_INPUT extends ValidationInputType, REQUIRED extends boolean> = {
export type PropertyValue<S, T extends PropertyType, V extends ValidationInputType, R extends boolean> = {
	valueSchema: S
	type: T
	required: R
	defaultTransformers?: any[]
	transformers?: any[]
	validators?: TypedValidatorFn<V>[];
	defaultValidators?: TypedValidatorFn<V>[];
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
