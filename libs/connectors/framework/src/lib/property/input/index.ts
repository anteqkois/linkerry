import { Validators } from '../../validators'
import { Properties, PropertyType } from '../base'
import { CheckboxProperty } from './checkbox'
import { DynamicDropdownProperty } from './dynamic-dropdown'
import { DynamicProperties } from './dynamic-properties'
import { NumberProperty } from './number'
import { StaticDropdownProperty, StaticDropdownValue } from './static-dropdown'
import { TextProperty } from './text'

export type InputProperty =
	| TextProperty
	| NumberProperty
	| CheckboxProperty
	| StaticDropdownProperty
	| DynamicDropdownProperty<boolean>
	| DynamicProperties<boolean>

export const Property = {
	Text<R extends boolean>(config: Properties<TextProperty<R>>): R extends true ? TextProperty<true> : TextProperty<false> {
		return {
			...config,
			valueSchema: undefined,
			type: PropertyType.TEXT,
			// TODO add processors
			// defaultProcessors: [Processors.string],
			defaultValidators: [Validators.string],
		} as unknown as R extends true ? TextProperty<true> : TextProperty<false>
	},
	Number<R extends boolean>(config: Properties<NumberProperty<R>>): R extends true ? NumberProperty<true> : NumberProperty<false> {
		return { ...config, type: PropertyType.NUMBER } as unknown as R extends true ? NumberProperty<true> : NumberProperty<false>
	},
	Checkbox<R extends boolean>(config: Properties<CheckboxProperty<R>>): R extends true ? CheckboxProperty<true> : CheckboxProperty<false> {
		return { ...config, valueSchema: undefined, type: PropertyType.CHECKBOX } as unknown as R extends true
			? CheckboxProperty<true>
			: CheckboxProperty<false>
	},
	StaticDropdown<T extends StaticDropdownValue, R extends boolean = boolean>(
		config: Properties<StaticDropdownProperty<T, R>>,
	): R extends true ? StaticDropdownProperty<T, true> : StaticDropdownProperty<T, false> {
		return { ...config, type: PropertyType.STATIC_DROPDOWN } as unknown as R extends true
			? StaticDropdownProperty<T, true>
			: StaticDropdownProperty<T, false>
	},
	DynamicDropdown<R extends boolean = boolean, S = any>(
		config: Properties<DynamicDropdownProperty<R, S>>,
	): R extends true ? DynamicDropdownProperty<true, S> : DynamicDropdownProperty<false, S> {
		return { ...config, valueSchema: undefined, type: PropertyType.DYNAMIC_DROPDOWN } as unknown as R extends true
			? DynamicDropdownProperty<true, S>
			: DynamicDropdownProperty<false, S>
	},
	DynamicProperties<R extends boolean = boolean>(
		config: Properties<DynamicProperties<R>>,
	): R extends true ? DynamicProperties<true> : DynamicProperties<false> {
		return { ...config, valueSchema: undefined, type: PropertyType.DYNAMIC } as unknown as R extends true
			? DynamicProperties<true>
			: DynamicProperties<false>
	},
}
