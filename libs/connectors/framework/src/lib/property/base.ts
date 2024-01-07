import { TypedValidatorFn, ValidationInputType } from '../validators/types'

export enum PropertyType {
	Text = 'ShortText',
	LongText = 'LongText',
	Markdown = 'Markdown',
	StaticDropdown = 'StaticDropdown',
	Number = 'Number',
	Checkbox = 'Checkbox',
	// OAuth2 = 'OAuth2',
	SecretText = 'SecretText',
	// Array = 'Array',
	// Object = 'Object',
	BasicAuth = 'BasicAuth',
	// JSON = 'JSON',
	// MultiSelectDropdown = 'MultiSelectDropdown',
	// StaticMultiSelectDropdown = 'StaticMultiSelectDropdown',
	DynamicDropdown = 'DynamicDropdown',
	CustomAuth = 'CustomAuth',
	// DateTime = "DateTime",
	// File = "File"
}

export type BaseProperty = {
	name: string
	displayName: string
	description: string
	// validate: ()=>{}
}

type PieceAuthValidatorParams<AuthValueSchema> = {
	auth: AuthValueSchema
}

export type PieceAuthValidatorResponse = { valid: true } | { valid: false; error: string }

export type BaseConnectorAuthSchema<AuthValueSchema> = BaseProperty & {
	validate?: (params: PieceAuthValidatorParams<AuthValueSchema>) => Promise<PieceAuthValidatorResponse>
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
	defaultValue?: T extends PropertyType.Text
		? string
		: T extends PropertyType.LongText
		? string
		: T extends PropertyType.StaticDropdown
		? unknown
		: T extends PropertyType.Number
		? number
		: T extends PropertyType.SecretText
		? string
		: T extends PropertyType.Checkbox
		? boolean
		: unknown
}
