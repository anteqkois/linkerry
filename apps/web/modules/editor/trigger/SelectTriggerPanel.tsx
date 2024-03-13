import { ConnectorMetadataSummary, connectorTag } from '@linkerry/connectors-framework'
import { Row } from '@tanstack/react-table'
import { HTMLAttributes, useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { DataTable } from '../../../shared/components/Table/Table'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { columns } from '../../flows/connectors/table/defaultColumns'
import { useEditor } from '../useEditor'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

export const SelectTriggerPanel = () => {
	const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
	const { handleSelectTriggerConnector } = useEditor()
	const connectorsWithTriggers = useMemo(() => {
		if (!data?.length) return []
		return data.filter((connectorMetadata) => connectorMetadata.triggers)
	}, [data])

	const handleSelectTrigger = async (row: Row<ConnectorMetadataSummary>) => {
		await handleSelectTriggerConnector(row.original)
	}

	return (
		<div>
			<DataTable
				getRowId={(row) => row._id}
				onClickRow={handleSelectTrigger}
				data={connectorsWithTriggers}
				columns={columns}
				filterAccessor="displayName"
				chooseFilters={[
					{
						accessor: 'tags',
						title: 'Tags',
						options: connectorTag.map((tag) => ({
							label: tag,
							value: tag,
						})),
					},
				]}
				onlyColumns={['logoUrl', 'displayName']}
				clickable
			/>
		</div>
	)
}
