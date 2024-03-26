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

export const DynamicField = (props: DynamicFieldProps) => {
	switch (props.property.type) {
		case PropertyType.TEXT:
			return <TextField name={props.name} property={props.property} refreshedProperties={props.refreshedProperties} />
		case PropertyType.SECRET_TEXT:
			return <SecretTextField name={props.name} property={props.property} refreshedProperties={props.refreshedProperties} />
		case PropertyType.NUMBER:
			return <NumberField name={props.name} property={props.property} refreshedProperties={props.refreshedProperties} />
		case PropertyType.CHECKBOX:
			return <CheckboxField name={props.name} property={props.property} refreshedProperties={props.refreshedProperties} />
		case PropertyType.STATIC_DROPDOWN:
			return <VirtualizedSelect name={props.name} property={props.property} refreshedProperties={props.refreshedProperties} />
		case PropertyType.DYNAMIC_DROPDOWN:
			return <DynamicVirtualizedSelect name={props.name} property={props.property} refreshedProperties={props.refreshedProperties} />

		default:
			break
	}
}
