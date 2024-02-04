import { ConnectorMetadataSummary, connectorTag } from '@linkerry/connectors-framework'
import { Row } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { DataTable } from '../../../shared/components/table/Table'
import { connectorsMetadataQueryConfig } from '../../connectors-metadata/api/query-configs'
import { columns } from '../../connectors-metadata/table/defaultColumns'
import { useEditor } from '../useEditor'

export const SelectActionPanel = () => {
	const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
	const { handleSelectActionConnector } = useEditor()
	const connectorsWithActions = useMemo(() => {
		if (!data?.length) return []
		return data.filter((connectorMetadata) => connectorMetadata.actions)
	}, [data])

	const handleSelectTrigger = async (row: Row<ConnectorMetadataSummary>) => {
		handleSelectActionConnector(row.original)
	}

	return (
		<div>
			<DataTable
				getRowId={(row) => row._id}
				onClickRow={handleSelectTrigger}
				data={connectorsWithActions}
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
