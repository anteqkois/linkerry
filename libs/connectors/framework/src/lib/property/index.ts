import { BasicAuthProperty } from './base-auth'
import { DropdownProperty } from './dropdown'
import { TextProperty } from './text'

export enum PropertyType {
  Text = 'ShortText',
  LongText = 'LongText',
  // Markdown = 'Markdown',
  Dropdown = 'Dropdown',
  // StaticDropdown = "StaticDropdown",
  Number = 'Number',
  Checkbox = 'Checkbox',
  // OAuth2 = 'OAuth2',
  SecretText = 'SecretText',
  // Array = 'Array',
  // Object = 'Object',
  // BasicAuth = "BasicAuth",
  // JSON = 'JSON',
  // MultiSelectDropdown = 'MultiSelectDropdown',
  // StaticMultiSelectDropdown = 'StaticMultiSelectDropdown',
  // Dynamic = "Dynamic",
  // CustomAuth = "CustomAuth",
  // DateTime = "DateTime",
  // File = "File"
}

export type BaseProperty = {
  name: string
  displayName: string
  description: string
}

export type PropertyValue<S, T extends PropertyType, R extends boolean> = {
  valueSchema: S
  type: T
  required: R
  defaultTransformers?: any[]
  transformers?: any[]
  validators?: any[]
  defaultValidators?: any[]
  defaultValue?: T extends PropertyType.Text
    ? string
    : T extends PropertyType.LongText
    ? string
    : T extends PropertyType.Dropdown
    ? unknown
    : T extends PropertyType.Number
    ? number
    : T extends PropertyType.SecretText
    ? string
    : T extends PropertyType.Checkbox
    ? boolean
    : unknown
}

export type ConnectorAuthProperty = BasicAuthProperty<boolean>
// | CustomAuthProperty<boolean, any>
// | OAuth2Property<boolean, OAuth2Props>
// | SecretTextProperty<boolean>

export type ConnectorProperty = TextProperty<boolean> | DropdownProperty

export interface ConnectorPropertyMap {
  [name: string]: ConnectorProperty
}

export type PropertyConfig<S, T extends PropertyType, R extends boolean> = Omit<BaseProperty & PropertyValue<S, T, R>, 'type' | 'valueSchema'>

// export type ConnectorPropValueSchema<T extends ConnectorProperty | ConnectorAuthProperty> =
export type ConnectorPropValueSchema<T extends ConnectorProperty> = T extends undefined
  ? undefined
  : T extends { required: true }
  ? T['valueSchema']
  : T['valueSchema'] | undefined

export type StaticPropsValue<T extends ConnectorPropertyMap> = {
  [P in keyof T]: ConnectorPropValueSchema<T[P]>
}

export const Property = {
  Text<R extends boolean>(config: PropertyConfig<string, PropertyType.Text, R>): R extends true ? TextProperty<true> : TextProperty<false> {
    return { ...config, type: PropertyType.Text } as unknown as R extends true ? TextProperty<true> : TextProperty<false>
  },
}

// export const ConnectorAuth = {
// 	SecretText<R extends boolean>(request: Properties<SecretTextProperty<R>>): R extends true ? SecretTextProperty<true> : SecretTextProperty<false> {
// 		return { ...request, valueSchema: undefined, type: PropertyType.SECRET_TEXT } as unknown as R extends true ? SecretTextProperty<true> : SecretTextProperty<false>;
// 	},
// 	BasicAuth<R extends boolean>(request: AuthProperties<BasicAuthProperty<R>>): R extends true ? BasicAuthProperty<true> : BasicAuthProperty<false> {
// 		return { ...request, valueSchema: undefined, type: PropertyType.BASIC_AUTH, displayName: 'Connection' } as unknown as R extends true ? BasicAuthProperty<true> : BasicAuthProperty<false>;
// 	},
// 	// CustomAuth<R extends boolean, T extends CustomAuthProps>(request: AuthProperties<CustomAuthProperty<R, T>>):
// 	// 	R extends true ? CustomAuthProperty<true, T> : CustomAuthProperty<false, T> {
// 	// 	return { ...request, valueSchema: undefined, type: PropertyType.CUSTOM_AUTH, displayName: 'Connection' } as unknown as R extends true ? CustomAuthProperty<true, T> : CustomAuthProperty<false, T>;
// 	// },
// 	// OAuth2<R extends boolean, T extends OAuth2Props>(request: AuthProperties<OAuth2Property<R, T>>): R extends true ? OAuth2Property<true, T> : OAuth2Property<false, T> {
// 	// 	return { ...request, valueSchema: undefined, type: PropertyType.OAUTH2, displayName: 'Connection' } as unknown as R extends true ? OAuth2Property<true, T> : OAuth2Property<false, T>;
// 	// },
// 	None() {
// 		return undefined;
// 	}
// };
