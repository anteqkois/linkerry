import { BaseProperty, PropertyType, PropertyValue } from './base'

export type BasicAuthPropertyValue = {
  username: string
  password: string
}

export type BasicAuthPropertySchema = {
  username: {
    displayName: string
    description?: string
  }
  password: {
    displayName: string
    description?: string
  }
}

export type BasicAuthProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<BasicAuthPropertyValue, PropertyType.BasicAuth, R>
