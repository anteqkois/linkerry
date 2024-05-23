import { ConnectorAuthProperty } from './authentication'
import { InputProperty } from './input'
import { isDynamicDropdownProperty } from './input/dynamic-dropdown'

export * from './authentication'
export * from './authentication/base'
export * from './authentication/basic-auth'
export * from './authentication/custom-auth'
export * from './authentication/oauth2-prop'
export * from './authentication/secret-text'
export * from './base'
export * from './input'
export * from './input/checkbox'
export * from './input/date-time'
export * from './input/dynamic-dropdown'
export * from './input/dynamic-properties'
export * from './input/file'
export * from './input/json'
export * from './input/markdown'
export * from './input/number'
export * from './input/static-dropdown'
export * from './input/text'

export type ConnectorProperty = InputProperty | ConnectorAuthProperty

export interface InputPropertyMap {
  [name: string]: InputProperty
}

export interface ConnectorPropertyMap {
  [name: string]: ConnectorProperty
}

export type ConnectorPropValueSchema<T extends ConnectorProperty> = T extends undefined
  ? undefined
  : T extends { required: true }
  ? T['valueSchema']
  : T['valueSchema'] | undefined

export type StaticPropsValue<T extends ConnectorPropertyMap> = {
  [P in keyof T]: ConnectorPropValueSchema<T[P]>
}

export const getRefreshersToRefreshedProperties = (props: ConnectorPropertyMap) => {
  const refresherToRefreshedProperty: Record<string, ConnectorProperty[]> = {}
  for (const [propertyName, property] of Object.entries(props)) {
    if (!isDynamicDropdownProperty(property)) {
      refresherToRefreshedProperty[propertyName] = []
      continue
    }
    if (!refresherToRefreshedProperty[propertyName]) refresherToRefreshedProperty[propertyName] = []

    for (const refresher of property.refreshers) {
      if (!refresherToRefreshedProperty[refresher]) refresherToRefreshedProperty[refresher] = []
      refresherToRefreshedProperty[refresher].push(property)
    }
  }

  return refresherToRefreshedProperty
}
