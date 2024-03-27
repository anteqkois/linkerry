import { OAuth2GrantType } from '@linkerry/shared'
import { BaseConnectorAuthSchema, PropertyType, PropertyValue, SecretTextProperty, StaticDropdownProperty, StaticPropsValue } from '..'
import { ValidationInputType } from '../../validators/types'
import { TextProperty } from '../input/text'

export enum OAuth2AuthorizationMethod {
	HEADER = 'HEADER',
	BODY = 'BODY',
}

type OAuthProp = TextProperty<true> | SecretTextProperty<boolean> | StaticDropdownProperty<any, true>

export type OAuth2Props = {
	[key: string]: OAuthProp
}

type OAuthPropsValue<T extends OAuth2Props> = StaticPropsValue<T>

type OAuth2ExtraProps = {
	props?: OAuth2Props,
	authUrl: string,
	tokenUrl: string,
	scope: string[],
	pkce?: boolean,
	authorizationMethod?: OAuth2AuthorizationMethod,
	grantType?: OAuth2GrantType,
	extra?: Record<string, unknown>,
}

export type OAuth2PropertyValue<T extends OAuth2Props = any> = {
	access_token: string
	props?: OAuthPropsValue<T>
	data: Record<string, any>
}

export type OAuth2Property<T extends OAuth2Props> = BaseConnectorAuthSchema<OAuth2PropertyValue> &
	OAuth2ExtraProps &
	PropertyValue<OAuth2PropertyValue<T>, PropertyType.OAUTH2, ValidationInputType.ANY, true>
