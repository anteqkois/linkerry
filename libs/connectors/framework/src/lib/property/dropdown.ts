import { BaseProperty, PropertyType, PropertyValue } from ".";

export type DropdownProperty = BaseProperty & PropertyValue<unknown, PropertyType.Dropdown, false>
