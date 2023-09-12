import { BaseProperty, PropertyValue } from '.';
import { PropertyType } from './base';

export type DropdownValue = string | number

type DropdownProps<V extends DropdownValue> = { options: { label: string; value: V }[] }

export type DropdownProperty<R extends boolean = boolean, V extends DropdownValue = DropdownValue> = BaseProperty &
  DropdownProps<V> &
  PropertyValue<V, PropertyType.Dropdown, R>
