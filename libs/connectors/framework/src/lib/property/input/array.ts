import { ValidationInputType } from '../../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from '../base'
import { CheckboxProperty } from './checkbox'
import { NumberProperty } from './number'
import { StaticDropdownProperty } from './static-dropdown'
import { TextProperty } from './text'

export type ArrayProperty<R extends boolean> = BaseProperty & {
	properties?: Record<
		string,
		| TextProperty<R>
		// | LongTextProperty<R>
		| StaticDropdownProperty<any, R>
		// | MultiSelectDropdownProperty<any, R>
		// | StaticMultiSelectDropdownProperty<any, R>
		| CheckboxProperty<R>
		| NumberProperty<R>
	>
} & PropertyValue<unknown[], PropertyType.ARRAY, ValidationInputType.ARRAY, R>
