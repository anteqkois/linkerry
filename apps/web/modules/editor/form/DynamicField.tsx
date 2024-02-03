import { ConnectorProperty, PropertyType } from '@linkerry/connectors-framework'
import { CheckboxField } from './CheckboxField'
import { NumberField } from './NumberField'
import { TextField } from './TextField'
import { VirtualizedSelect } from './VirtualizedSelect'

export const DynamicField = ({ property }: { property: ConnectorProperty }) => {
	switch (property.type) {
		case PropertyType.TEXT:
			return <TextField property={property} />
		case PropertyType.NUMBER:
			return <NumberField property={property} />
		case PropertyType.CHECKBOX:
			return <CheckboxField property={property} />
		case PropertyType.STATIC_DROPDOWN:
			return <VirtualizedSelect property={property} />

		default:
			break
	}
}
