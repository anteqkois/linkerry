import { StaticPropsValue } from "..";
import { ValidationInputType } from "../../validators/types";
import { PropertyType, PropertyValue } from "../base";
import { CheckboxProperty } from "../input/checkbox";
import { NumberProperty } from "../input/number";
import { StaticDropdownProperty } from "../input/static-dropdown";
import { ShortTextProperty } from "../input/text";
import { BaseConnectorAuthSchema } from "./base";
import { SecretTextProperty } from "./secret-text";


export type CustomAuthProps = Record<
	string,
	| ShortTextProperty<boolean>
	| SecretTextProperty<boolean>
	| NumberProperty<boolean>
	| StaticDropdownProperty
	| CheckboxProperty<boolean>
>

export type CustomAuthPropertyValue<T extends CustomAuthProps> = StaticPropsValue<T>;

export type CustomAuthPropertySchema<T extends CustomAuthProps> = BaseConnectorAuthSchema<CustomAuthPropertyValue<T>> & {
	props: T
}

export type CustomAuthProperty<T extends CustomAuthProps = CustomAuthProps> = CustomAuthPropertySchema<T> & PropertyValue<
	CustomAuthPropertyValue<T>,
	PropertyType.CUSTOM_AUTH,
	ValidationInputType.ANY,
	true
>;
