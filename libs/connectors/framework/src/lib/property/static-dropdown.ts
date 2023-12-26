import { BaseProperty, PropertyValue } from '.';
import { PropertyType } from './base';

export type StaticDropdownValue = string | number

type StaticDropdownProps<V extends StaticDropdownValue> = { options: { label: string; value: V }[] }

export type StaticDropdownProperty<R extends boolean = boolean, V extends StaticDropdownValue = StaticDropdownValue> = BaseProperty &
  StaticDropdownProps<V> &
  PropertyValue<V, PropertyType.StaticDropdown, R>
