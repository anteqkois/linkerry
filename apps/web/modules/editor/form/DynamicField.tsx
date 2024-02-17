import { ConnectorProperty, PropertyType } from '@linkerry/connectors-framework'
import { CheckboxField } from './CheckboxField'
import { DynamicVirtualizedSelect } from './DynamicVirtualizedSelect'
import { NumberField } from './NumberField'
import { TextField } from './TextField'
import { VirtualizedSelect } from './VirtualizedSelect'

interface DynamicFieldProps {
	property: ConnectorProperty
	name: string
}

export const DynamicField = (props: DynamicFieldProps) => {
	switch (props.property.type) {
		case PropertyType.TEXT:
			return <TextField {...props} />
		case PropertyType.NUMBER:
			return <NumberField {...props} />
		case PropertyType.CHECKBOX:
			return <CheckboxField {...props} />
		case PropertyType.STATIC_DROPDOWN:
			return <VirtualizedSelect name={props.name} property={props.property} />
		case PropertyType.DYNAMIC_DROPDOWN:
			return <DynamicVirtualizedSelect name={props.name} property={props.property} />

		default:
			break
	}
}
