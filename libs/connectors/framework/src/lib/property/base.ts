
export enum PropertyType {
  Text = 'ShortText',
  LongText = 'LongText',
  // Markdown = 'Markdown',
  Dropdown = 'Dropdown',
  // StaticDropdown = "StaticDropdown",
  Number = 'Number',
  Checkbox = 'Checkbox',
  // OAuth2 = 'OAuth2',
  SecretText = 'SecretText',
  // Array = 'Array',
  // Object = 'Object',
  BasicAuth = "BasicAuth",
  // JSON = 'JSON',
  // MultiSelectDropdown = 'MultiSelectDropdown',
  // StaticMultiSelectDropdown = 'StaticMultiSelectDropdown',
  // Dynamic = "Dynamic",
  // CustomAuth = "CustomAuth",
  // DateTime = "DateTime",
  // File = "File"
}

export type BaseProperty = {
  name: string
  displayName: string
  description: string
  // validate: ()=>{}
}

export type PropertyValue<S, T extends PropertyType, R extends boolean> = {
  valueSchema: S
  type: T
  required: R
  defaultTransformers?: any[]
  transformers?: any[]
  validators?: any[]
  defaultValidators?: any[]
  defaultValue?: T extends PropertyType.Text
    ? string
    : T extends PropertyType.LongText
    ? string
    : T extends PropertyType.Dropdown
    ? unknown
    : T extends PropertyType.Number
    ? number
    : T extends PropertyType.SecretText
    ? string
    : T extends PropertyType.Checkbox
    ? boolean
    : unknown
}
