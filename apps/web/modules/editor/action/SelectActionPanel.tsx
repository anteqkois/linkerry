import { ConnectorMetadataSummary, connectorTag } from '@linkerry/connectors-framework'
import { isCustomHttpExceptionAxios, isQuotaErrorCode } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
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
	const { showDialogBasedOnErrorCode } = useReachLimitDialog()
	const { handleSelectActionConnector } = useEditor()
	const { toast } = useToast()
	const connectorsWithActions = useMemo(() => {
		if (!data?.length) return []
		return data.filter((connectorMetadata) => connectorMetadata.actions)
	}, [data])

	const handleSelectAction = async (row: Row<ConnectorMetadataSummary>) => {
		try {
			await handleSelectActionConnector(row.original)
		} catch (error) {
			let errorDescription = 'We can not add new step to your flow. Please inform our Team'

			if (isCustomHttpExceptionAxios(error)) {
				if (isQuotaErrorCode(error.response.data.code)) return showDialogBasedOnErrorCode(error.response.data.code)
				else errorDescription = error.response.data.message
			}

			toast({
				title: 'Can not update Flow',
				description: errorDescription,
				variant: 'destructive',
			})
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
