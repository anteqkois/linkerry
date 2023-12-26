import { BaseProperty, PropertyValue } from '.'
import { PropertyContext } from '../context'
import { PropertyType } from './base'

// export type StaticDropdownValue = string | number

// type StaticDropdownProps<V extends StaticDropdownValue> = { options: { label: string; value: V }[] }

// export type StaticDropdownProperty<R extends boolean = boolean, V extends StaticDropdownValue = StaticDropdownValue> = BaseProperty &
//   StaticDropdownProps<V> &
//   PropertyValue<V, PropertyType.StaticDropdown, R>
export type DynamicDropdownState<T> = {
  disabled?: boolean
  placeholder?: string
  options: DropdownOption<T>[]
}

export type DropdownOption<T> = {
  label: string
  value: T
}

export type DynamicDropdownOptions<T> = (propsValue: Record<string, unknown>, ctx: PropertyContext) => Promise<DynamicDropdownState<T>>

export type DynamicDropdownProperty<T, R extends boolean> = BaseProperty & {
  refreshers: string[]
  options: DynamicDropdownOptions<T>
} & PropertyValue<T, PropertyType.DynamicDropdown, R>
// todo add validator type generic
// } & PropertyValue<T, PropertyType.DynamicDropdown, ValidationInputType.ANY, R>
