import { ConnectorProperty, PropertyType } from '@linkerry/connectors-framework'
import { CheckboxField } from './Inputs/CheckboxField'
import { DynamicVirtualizedSelect } from './Inputs/DynamicVirtualizedSelect'
import { LongTextField } from './Inputs/LongTextField'
import { MarkdownField } from './Inputs/MarkdownField'
import { NumberField } from './Inputs/NumberField'
import { SecretTextField } from './Inputs/SecretTextField'
import { ShortTextField } from './Inputs/ShortTextField'
import { VirtualizedSelect } from './Inputs/VirtualizedSelect'

interface DynamicFieldProps {
	property: ConnectorProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const FieldResolver = ({ name, property, refreshedProperties }: DynamicFieldProps) => {
	switch (property.type) {
		case PropertyType.SHORT_TEXT:
			return <ShortTextField name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.LONG_TEXT:
			return <LongTextField name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.SECRET_TEXT:
			return <SecretTextField name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.NUMBER:
			return <NumberField name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.CHECKBOX:
			return <CheckboxField name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.STATIC_DROPDOWN:
			return <VirtualizedSelect name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.DYNAMIC_DROPDOWN:
			return <DynamicVirtualizedSelect name={name} property={property} refreshedProperties={refreshedProperties} />
		case PropertyType.MARKDOWN:
			return <MarkdownField name={name} property={property} refreshedProperties={refreshedProperties} />

		default:
			break
	}
}
