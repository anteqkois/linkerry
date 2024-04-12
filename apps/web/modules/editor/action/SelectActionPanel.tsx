import { ConnectorMetadataSummary, connectorTag } from '@linkerry/connectors-framework'
import { isQuotaError } from '@linkerry/shared'
import { Row } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { DataTable } from '../../../shared/components/Table/Table'
import { useReachLimitDialog } from '../../billing/useReachLimitDialog'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { columns } from '../../flows/connectors/table/defaultColumns'
import { useEditor } from '../useEditor'

export const SelectActionPanel = () => {
	const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
	const { isQuotaErrorThenShowDialog, setCustomConfigurationItemValues } = useReachLimitDialog()
	const { handleSelectActionConnector, flow, limits } = useEditor()
	const connectorsWithActions = useMemo(() => {
		if (!data?.length) return []
		return data.filter((connectorMetadata) => connectorMetadata.actions)
	}, [data])

	const handleSelectAction = async (row: Row<ConnectorMetadataSummary>) => {
		try {
			await handleSelectActionConnector(row.original)
		} catch (error) {
			if (isQuotaError(error) && isQuotaErrorThenShowDialog(error)) {
				return setCustomConfigurationItemValues({
					flowSteps: `${flow.version.stepsCount} / ${limits.flowSteps}`,
				})
			}
		}
	}

	return (
		<div className="p-1">
			<DataTable
				getRowId={(row) => row._id}
				onClickRow={handleSelectAction}
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
