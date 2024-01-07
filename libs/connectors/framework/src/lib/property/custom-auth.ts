import { StaticPropsValue } from ".";
import { ValidationInputType } from "../validators/types";
import { BaseConnectorAuthSchema, PropertyType, PropertyValue } from "./base";
import { CheckboxProperty } from "./checkbox";
import { NumberProperty } from "./number";
import { SecretTextProperty } from "./secretText";
import { StaticDropdownProperty } from "./static-dropdown";
import { TextProperty } from "./text";


export type CustomAuthProps = Record<
	string,
	| TextProperty<boolean>
	| SecretTextProperty<boolean>
	| NumberProperty<boolean>
	| StaticDropdownProperty
	| CheckboxProperty<boolean>
>

export type CustomAuthPropertyValue<T extends CustomAuthProps> = StaticPropsValue<T>;

export type CustomAuthPropertySchema<T extends CustomAuthProps> = BaseConnectorAuthSchema<CustomAuthPropertyValue<T>> & {
	props: T
}

export type CustomAuthProperty<R extends boolean, T extends CustomAuthProps> = CustomAuthPropertySchema<T> & PropertyValue<
	CustomAuthPropertyValue<T>,
	PropertyType.CustomAuth,
	ValidationInputType.ANY,
	R
>;
