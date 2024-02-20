import { Validators } from '../../validators'
import { Properties, PropertyType } from '../base'
import { BasicAuthProperty } from './basic-auth'
import { CustomAuthProperty, CustomAuthProps } from './custom-auth'
import { SecretTextProperty } from './secret-text'

export type ConnectorAuthProperty = SecretTextProperty | BasicAuthProperty | CustomAuthProperty<any>

type AuthProperties<T> = Omit<Properties<T>, 'displayName'>

export const ConnectorAuth = {
	SecretText<R extends boolean>(config: Properties<SecretTextProperty<R>>): R extends true ? SecretTextProperty<true> : SecretTextProperty<false> {
		return {
			...config,
			valueSchema: undefined,
			type: PropertyType.SECRET_TEXT,
			defaultValidators: [Validators.string],
		} as unknown as R extends true ? SecretTextProperty<true> : SecretTextProperty<false>
	},
	BasicAuth(config: AuthProperties<BasicAuthProperty>): BasicAuthProperty {
		return { ...config, valueSchema: undefined, type: PropertyType.BASIC_AUTH, displayName: 'Connection' } as unknown as BasicAuthProperty
	},
	CustomAuth<T extends CustomAuthProps>(config: AuthProperties<CustomAuthProperty<T>>): CustomAuthProperty<T> {
		return { ...config, valueSchema: undefined, type: PropertyType.CUSTOM_AUTH, displayName: 'Connection' } as unknown as CustomAuthProperty<T>
	},
	None() {
		return undefined
	},
}
