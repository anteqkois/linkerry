import { Processors } from '../../processors/processors'
import { Validators } from '../../validators'
import { Properties, PropertyType } from '../base'
import { ArrayProperty } from './array'
import { CheckboxProperty } from './checkbox'
import { DateTimeProperty } from './date-time'
import { DynamicDropdownProperty } from './dynamic-dropdown'
import { DynamicProperties } from './dynamic-properties'
import { JsonProperty } from './json'
import { MarkDownProperty } from './markdown'
import { NumberProperty } from './number'
import { ObjectProperty } from './object'
import { StaticDropdownProperty, StaticDropdownValue } from './static-dropdown'
import { LongTextProperty, ShortTextProperty } from './text'

export type InputProperty =
  | ShortTextProperty
  | LongTextProperty
  | NumberProperty
  | CheckboxProperty
  | StaticDropdownProperty<boolean>
  | DynamicDropdownProperty<boolean>
  | DynamicProperties<boolean>
  | ObjectProperty<boolean>
  | JsonProperty<boolean>
  | ArrayProperty<boolean>
  | MarkDownProperty
  | DateTimeProperty

export const Property = {
  ShortText<R extends boolean>(config: Properties<ShortTextProperty<R>>): R extends true ? ShortTextProperty<true> : ShortTextProperty<false> {
    return {
      ...config,
      valueSchema: undefined,
      type: PropertyType.SHORT_TEXT,
      defaultProcessors: [Processors.string],
      defaultValidators: [Validators.string],
    } as unknown as R extends true ? ShortTextProperty<true> : ShortTextProperty<false>
  },
  LongText<R extends boolean>(config: Properties<LongTextProperty<R>>): R extends true ? LongTextProperty<true> : LongTextProperty<false> {
    return {
      ...config,
      valueSchema: undefined,
      type: PropertyType.LONG_TEXT,
      defaultValidators: [Validators.string],
    } as unknown as R extends true ? LongTextProperty<true> : LongTextProperty<false>
  },
  MarkDown(config: Pick<Properties<MarkDownProperty>, 'displayName' | 'description'>): MarkDownProperty {
    return {
      ...config,
      required: false,
      type: PropertyType.MARKDOWN,
      valueSchema: undefined as never,
    }
  },
  Number<R extends boolean>(config: Properties<NumberProperty<R>>): R extends true ? NumberProperty<true> : NumberProperty<false> {
    return {
      ...config,
      type: PropertyType.NUMBER,
      defaultProcessors: [Processors.number],
      defaultValidators: [Validators.number],
    } as unknown as R extends true ? NumberProperty<true> : NumberProperty<false>
  },
  Checkbox<R extends boolean>(config: Properties<CheckboxProperty<R>>): R extends true ? CheckboxProperty<true> : CheckboxProperty<false> {
    return { ...config, valueSchema: undefined, type: PropertyType.CHECKBOX } as unknown as R extends true
      ? CheckboxProperty<true>
      : CheckboxProperty<false>
  },
  Json<R extends boolean>(request: Properties<JsonProperty<R>>): R extends true ? JsonProperty<true> : JsonProperty<false> {
    return {
      ...request,
      valueSchema: undefined,
      type: PropertyType.JSON,
      defaultProcessors: [Processors.json],
    } as unknown as R extends true ? JsonProperty<true> : JsonProperty<false>
  },
  Array<R extends boolean>(config: Properties<ArrayProperty<R>>): R extends true ? ArrayProperty<true> : ArrayProperty<false> {
    return {
      ...config,
      valueSchema: undefined,
      type: PropertyType.ARRAY,
    } as unknown as R extends true ? ArrayProperty<true> : ArrayProperty<false>
  },
  Object<R extends boolean>(config: Properties<ObjectProperty<R>>): R extends true ? ObjectProperty<true> : ObjectProperty<false> {
    return {
      ...config,
      valueSchema: undefined,
      type: PropertyType.OBJECT,
    } as unknown as R extends true ? ObjectProperty<true> : ObjectProperty<false>
  },
  StaticDropdown<T extends StaticDropdownValue, R extends boolean = boolean>(
    config: Properties<StaticDropdownProperty<R, T>>,
  ): R extends true ? StaticDropdownProperty<true, T> : StaticDropdownProperty<false, T> {
    return { ...config, valueSchema: undefined, type: PropertyType.STATIC_DROPDOWN } as unknown as R extends true
      ? StaticDropdownProperty<true, T>
      : StaticDropdownProperty<false, T>
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
  DateTime<R extends boolean>(request: Properties<DateTimeProperty<R>>): R extends true ? DateTimeProperty<true> : DateTimeProperty<false> {
    return {
      ...request,
      defaultProcessors: [Processors.datetime],
      defaultValidators: [Validators.datetimeIso],
      valueSchema: undefined,
      type: PropertyType.DATE_TIME,
    } as unknown as R extends true ? DateTimeProperty<true> : DateTimeProperty<false>
  },
}

export type DynamicDropdownConfigOverwrite<R extends boolean = boolean, T = any> = Partial<Properties<DynamicDropdownProperty<R, T>>>
export type StaticDropdownConfigOverwrite<R extends boolean = boolean, T = any> = Partial<Properties<StaticDropdownProperty<R, T>>>
export type NumberConfigOverwrite<R extends boolean = boolean> = Partial<Properties<NumberProperty<R>>>
export type DateTimeConfigOverwrite<R extends boolean = boolean> = Partial<Properties<DateTimeProperty<R>>>
