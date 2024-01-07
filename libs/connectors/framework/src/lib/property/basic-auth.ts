import { ValidationInputType } from '../validators/types'
import { BaseConnectorAuthSchema, PropertyType, PropertyValue } from './base'

export type BasicAuthPropertyValue = {
	username: string
	password: string
}

export type BasicAuthPropertySchema = BaseConnectorAuthSchema<BasicAuthPropertyValue> & {
	username: {
		displayName: string
		description?: string
	}
	password: {
		displayName: string
		description?: string
	}
}

export type BasicAuthProperty<R extends boolean = boolean> = BasicAuthPropertySchema &
	PropertyValue<BasicAuthPropertyValue, PropertyType.BasicAuth, ValidationInputType.ANY, R>
