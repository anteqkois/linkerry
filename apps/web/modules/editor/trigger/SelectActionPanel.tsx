import { ConnectorMetadataSummary, connectorTag } from '@linkerry/connectors-framework'
import { ActionConnector, ActionType } from '@linkerry/shared'
import { Row } from '@tanstack/react-table'
import { HTMLAttributes, useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { DataTable } from '../../../shared/components/table/Table'
import { connectorsMetadataQueryConfig } from '../../connectors-metadata/api/query-configs'
import { columns } from '../../connectors-metadata/table/defaultColumns'
import { useEditor } from '../useEditor'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

export const SelectActionPanel = () => {
	const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
	const { onAddAction, editStepMetadata } = useEditor()
	const connectorsWithActions = useMemo(() => {
		if (!data?.length) return []
		return data.filter((connectorMetadata) => connectorMetadata.actions)
	}, [data])

	const handleSelectTrigger = async (row: Row<ConnectorMetadataSummary>) => {
		if (!editStepMetadata?.actionName) throw new Error('Can not retrive actionName')

		const newAction: ActionConnector = {
			name: editStepMetadata?.actionName,
			displayName: row.original.displayName,
			type: ActionType.CONNECTOR,
			valid: false,
			settings: {
				connectorName: row.original.name,
				connectorVersion: row.original.version,
				connectorType: row.original.connectorType,
				actionName: '',
				input: {},
				inputUiInfo: {},
			},
			nextActionName: '',
		}

		onAddAction(newAction, row.original)
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
