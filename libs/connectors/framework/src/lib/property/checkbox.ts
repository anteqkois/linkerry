import { BaseProperty, PropertyValue } from ".";
import { PropertyType } from "./base";

export type CheckboxProperty<R extends boolean = boolean> = BaseProperty & PropertyValue<boolean, PropertyType.Checkbox, R>;
