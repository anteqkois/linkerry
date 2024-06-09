import { ConnectorProperty, PropertyType } from '@linkerry/connectors-framework'
import { CheckboxField } from './Inputs/CheckboxField'
import { DynamicVirtualizedSelect } from './Inputs/DynamicVirtualizedSelect'
import { JsonField } from './Inputs/JsonField'
import { LongTextField } from './Inputs/LongTextField'
import { MarkdownField } from './Inputs/MarkdownField'
import { NumberField } from './Inputs/NumberField'
import { SecretTextField } from './Inputs/SecretTextField'
import { ShortTextField } from './Inputs/ShortTextField'
import { VirtualizedCombobox } from './Inputs/VirtualizedCombobox'
import { DynamicFieldProvider } from './useFieldCustomValidation'

interface DynamicFieldProps {
  property: ConnectorProperty
  name: string
  refreshedProperties: ConnectorProperty[]
}

export const FieldResolver = ({ name, property, refreshedProperties }: DynamicFieldProps) => {
  switch (property.type) {
    case PropertyType.SHORT_TEXT:
      return (
        <DynamicFieldProvider property={property}>
          <ShortTextField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.LONG_TEXT:
      return (
        <DynamicFieldProvider property={property}>
          <LongTextField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.SECRET_TEXT:
      return (
        <DynamicFieldProvider property={property}>
          <SecretTextField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.NUMBER:
      return (
        <DynamicFieldProvider property={property}>
          <NumberField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.CHECKBOX:
      return (
        <DynamicFieldProvider property={property}>
          <CheckboxField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.STATIC_DROPDOWN:
      return (
        <DynamicFieldProvider property={property}>
          <VirtualizedCombobox name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.DYNAMIC_DROPDOWN:
      return (
        <DynamicFieldProvider property={property}>
          <DynamicVirtualizedSelect name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.MARKDOWN:
      return (
        <DynamicFieldProvider property={property}>
          <MarkdownField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    case PropertyType.JSON:
      return (
        <DynamicFieldProvider property={property}>
          <JsonField name={name} property={property} refreshedProperties={refreshedProperties} />
        </DynamicFieldProvider>
      )
    default:
      break
  }
}
