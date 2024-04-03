import { ConnectorProperty, MarkDownProperty } from '@linkerry/connectors-framework'
import { MarkdownBase } from '../../../shared/components/Markdown/MarkdownBase'
import { PropertyLabel } from './PropertyLabel'

interface MarkdownPropertyProps {
	property: MarkDownProperty
	name: string
	refreshedProperties: ConnectorProperty[]
}

export const MarkdownProperty = ({ property, refreshedProperties }: MarkdownPropertyProps) => {
	return (
		<div className='space-y-1'>
			<PropertyLabel property={property} refreshedProperties={refreshedProperties} />
			<MarkdownBase className="w-full rounded-md border border-dashed border-input bg-card p-3 text-sm shadow-sm">{property.description}</MarkdownBase>
		</div>
	)
}
