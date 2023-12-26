import { PropertyType } from './base'
import { BasicAuthProperty } from './base-auth'
import { CheckboxProperty } from './checkbox'
import { DynamicDropdownProperty } from './dynamic-dropdown'
import { NumberProperty } from './number'
import { SecretTextProperty } from './secretText'
import { StaticDropdownProperty, StaticDropdownValue } from './static-dropdown'
import { TextProperty } from './text'

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

export type ConnectorAuthProperty = SecretTextProperty | BasicAuthProperty
// export type ConnectorAuthProperty = SecretTextProperty
// export type ConnectorAuthProperty = BasicAuthProperty
// | CustomAuthProperty<boolean, any>
// | OAuth2Property<boolean, OAuth2Props>
// | SecretTextProperty<boolean>

export type ConnectorProperty = TextProperty | NumberProperty | CheckboxProperty | StaticDropdownProperty | DynamicDropdownProperty<any, boolean>

export interface ConnectorPropertyMap {
  [name: string]: ConnectorProperty
}

export type ConnectorPropValueSchema<T extends ConnectorProperty | ConnectorAuthProperty> = T extends undefined
  ? undefined
  : T extends { required: true }
  ? T['valueSchema']
  : T['valueSchema'] | undefined

export type StaticPropsValue<T extends ConnectorPropertyMap> = {
  [P in keyof T]: ConnectorPropValueSchema<T[P]>
}

type Properties<T> = Omit<T, 'valueSchema' | 'type'>

export const Property = {
  Text<R extends boolean>(config: Properties<TextProperty<R>>): R extends true ? TextProperty<true> : TextProperty<false> {
    return { ...config, type: PropertyType.Text } as unknown as R extends true ? TextProperty<true> : TextProperty<false>
  },
  Number<R extends boolean>(config: Properties<NumberProperty<R>>): R extends true ? NumberProperty<true> : NumberProperty<false> {
    return { ...config, type: PropertyType.Number } as unknown as R extends true ? NumberProperty<true> : NumberProperty<false>
  },
  Checkbox<R extends boolean>(request: Properties<CheckboxProperty<R>>): R extends true ? CheckboxProperty<true> : CheckboxProperty<false> {
    return { ...request, valueSchema: undefined, type: PropertyType.Checkbox } as unknown as R extends true
      ? CheckboxProperty<true>
      : CheckboxProperty<false>
  },
  SecretText<R extends boolean>(config: Properties<SecretTextProperty<R>>): R extends true ? SecretTextProperty<true> : SecretTextProperty<false> {
    return { ...config, type: PropertyType.Text } as unknown as R extends true ? SecretTextProperty<true> : SecretTextProperty<false>
  },
  StaticDropdown<T extends StaticDropdownValue, R extends boolean = boolean>(
    config: Properties<StaticDropdownProperty<T, R>>,
  ): R extends true ? StaticDropdownProperty<T, true> : StaticDropdownProperty<T, false> {
    return { ...config, type: PropertyType.StaticDropdown } as unknown as R extends true
      ? StaticDropdownProperty<T, true>
      : StaticDropdownProperty<T, false>
  },
  DynamicDropdown<T, R extends boolean = boolean>(
    config: Properties<DynamicDropdownProperty<T, R>>,
  ): R extends true ? DynamicDropdownProperty<T, true> : DynamicDropdownProperty<T, false> {
    return { ...config, valueSchema: undefined, type: PropertyType.DynamicDropdown } as unknown as R extends true
      ? DynamicDropdownProperty<T, true>
      : DynamicDropdownProperty<T, false>
  },
}

export const ConnectorAuth = {
  SecretText<R extends boolean>(config: Properties<SecretTextProperty<R>>): R extends true ? SecretTextProperty<true> : SecretTextProperty<false> {
    return { ...config } as unknown as R extends true ? SecretTextProperty<true> : SecretTextProperty<false>
  },
  BasicAuth<R extends boolean>(config: Properties<BasicAuthProperty<R>>): R extends true ? BasicAuthProperty<true> : BasicAuthProperty<false> {
    return { ...config } as unknown as R extends true ? BasicAuthProperty<true> : BasicAuthProperty<false>
  },
  None() {
    return undefined
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
