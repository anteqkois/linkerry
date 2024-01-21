import { ValidationInputType } from '../validators/types';
import { BaseProperty, PropertyType, PropertyValue } from './base';

export type StaticDropdownValue = string | number

export type StaticDropdownState<T> = {
	disabled?: boolean;
	placeholder?: string;
	options: StaticDropdownOption<T>[];
}

export type StaticDropdownOption<T> = {
	label: string;
	value: T;
};

type StaticDropdownProps<T extends StaticDropdownValue> = { options: StaticDropdownState<T>; }

export type StaticDropdownProperty<T extends StaticDropdownValue = StaticDropdownValue , R extends boolean = boolean> = BaseProperty &
  StaticDropdownProps<T> &
  PropertyValue<T, PropertyType.STATIC_DROPDOWN, ValidationInputType.ANY, R>
