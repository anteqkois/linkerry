import { ConnectorProperty, PropertyType } from '@linkerry/connectors-framework'
import { CheckboxField } from './CheckboxField'
import { DynamicVirtualizedSelect } from './DynamicVirtualizedSelect'
import { NumberField } from './NumberField'
import { SecretTextField } from './SecretTextField'
import { TextField } from './TextField'
import { VirtualizedSelect } from './VirtualizedSelect'

interface DynamicFieldProps {
	property: ConnectorProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const DynamicField = ({ name, property, refreshedProperties }: DynamicFieldProps) => {
	switch (property.type) {
		case PropertyType.TEXT:
			return <TextField name={name} property={property} refreshedProperties={refreshedProperties} />
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

		default:
			break
	}
}
