import { Processors } from '../../processors/processors'
import { Validators } from '../../validators'
import { Properties, PropertyType } from '../base'
import { ArrayProperty } from './array'
import { CheckboxProperty } from './checkbox'
import { DynamicDropdownProperty } from './dynamic-dropdown'
import { DynamicProperties } from './dynamic-properties'
import { JsonProperty } from './json'
import { NumberProperty } from './number'
import { ObjectProperty } from './object'
import { StaticDropdownProperty, StaticDropdownValue } from './static-dropdown'
import { TextProperty } from './text'

export type InputProperty =
	| TextProperty
	| NumberProperty
	| CheckboxProperty
	| StaticDropdownProperty
	| DynamicDropdownProperty<boolean>
	| DynamicProperties<boolean>
	| ObjectProperty<boolean>
	| JsonProperty<boolean>
	| ArrayProperty<boolean>

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
		return { ...config, type: PropertyType.NUMBER, defaultValidators: [Validators.number] } as unknown as R extends true
			? NumberProperty<true>
			: NumberProperty<false>
	},
	Checkbox<R extends boolean>(config: Properties<CheckboxProperty<R>>): R extends true ? CheckboxProperty<true> : CheckboxProperty<false> {
		return { ...config, valueSchema: undefined, type: PropertyType.CHECKBOX } as unknown as R extends true
			? CheckboxProperty<true>
			: CheckboxProperty<false>
	},
	Json<R extends boolean>(
    request: Properties<JsonProperty<R>>
  ): R extends true ? JsonProperty<true> : JsonProperty<false> {
    return {
      ...request,
      valueSchema: undefined,
      type: PropertyType.JSON,
      defaultProcessors: [Processors.json],
    } as unknown as R extends true ? JsonProperty<true> : JsonProperty<false>;
  },
  Array<R extends boolean>(
    request: Properties<ArrayProperty<R>>
  ): R extends true ? ArrayProperty<true> : ArrayProperty<false> {
    return {
      ...request,
      valueSchema: undefined,
      type: PropertyType.ARRAY,
    } as unknown as R extends true ? ArrayProperty<true> : ArrayProperty<false>;
  },
	Object<R extends boolean>(
    config: Properties<ObjectProperty<R>>
  ): R extends true ? ObjectProperty<true> : ObjectProperty<false> {
    return {
      ...config,
      valueSchema: undefined,
      type: PropertyType.OBJECT,
    } as unknown as R extends true
      ? ObjectProperty<true>
      : ObjectProperty<false>;
  },
	StaticDropdown<T extends StaticDropdownValue, R extends boolean = boolean>(
		config: Properties<StaticDropdownProperty<T, R>>,
	): R extends true ? StaticDropdownProperty<T, true> : StaticDropdownProperty<T, false> {
		return { ...config, type: PropertyType.STATIC_DROPDOWN } as unknown as R extends true
			? StaticDropdownProperty<T, true>
			: StaticDropdownProperty<T, false>
	},
	DynamicDropdown<R extends boolean = boolean, T = any>(
		config: Properties<DynamicDropdownProperty<R, T>>,
	): R extends true ? DynamicDropdownProperty<true, T> : DynamicDropdownProperty<false, T> {
		return { ...config, valueSchema: undefined, type: PropertyType.DYNAMIC_DROPDOWN } as unknown as R extends true
			? DynamicDropdownProperty<true, T>
			: DynamicDropdownProperty<false, T>
	},
	DynamicProperties<R extends boolean = boolean>(
		config: Properties<DynamicProperties<R>>,
	): R extends true ? DynamicProperties<true> : DynamicProperties<false> {
		return { ...config, valueSchema: undefined, type: PropertyType.DYNAMIC } as unknown as R extends true
			? DynamicProperties<true>
			: DynamicProperties<false>
	},
}
