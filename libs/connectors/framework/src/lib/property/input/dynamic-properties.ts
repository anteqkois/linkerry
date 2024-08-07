import { PropertyContext } from '../../context'
import { ValidationInputType } from '../../validators/types'
import { BaseProperty, PropertyType, PropertyValue } from '../base'
import { StaticDropdownProperty } from './static-dropdown'
import { ShortTextProperty } from './text'

type DynamicProp = ShortTextProperty<boolean> | StaticDropdownProperty<any, boolean> // | StaticMultiSelectDropdownProperty<any,boolean>;

// export type DynamicPropsValue = Record<string, DynamicProp['valueSchema']>
export type DynamicPropsValue = Record<string, any> // TODO temp fix

export type DynamicPropsSchema = BaseProperty & {
  props: (propsValue: Record<string, DynamicPropsValue>, ctx: PropertyContext) => Promise<Record<string, DynamicProp>>
  refreshers: string[]
}

export type DynamicProperties<R extends boolean> = DynamicPropsSchema &
  PropertyValue<DynamicPropsValue, PropertyType.DYNAMIC, ValidationInputType.ANY, R>
