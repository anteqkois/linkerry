'use client'

import { ConnectorMetadataSummary, connectorTag } from '@linkerry/connectors-framework'
import { ColumnDef } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import { useClientQuery } from '../../../../libs/react-query'
import { ErrorInfo } from '../../../../shared/components/ErrorInfo'
import { DataTable } from '../../../../shared/components/table/Table'
import { connectorsMetadataQueryConfig } from '../api/query-configs'
import { columns } from './defaultColumns'

type ColumnKey = keyof ConnectorMetadataSummary | 'buttons'

export interface ConnectorsTableProps extends HTMLAttributes<HTMLElement> {
	onlyColumns?: ColumnKey[]
	customColums?: ColumnDef<ConnectorMetadataSummary>[]
	mobileCollumns?: ColumnKey[]
	desktopCollumns?: ColumnKey[]
}

const defaultMobileColumns: ColumnKey[] = ['logoUrl', 'displayName', 'tags']

export const ConnectorsTable = ({ onlyColumns, mobileCollumns, desktopCollumns, customColums }: ConnectorsTableProps) => {
	const { data, error } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())

	if (error) return <ErrorInfo errorObject={error} />

	return (
		<DataTable
			data={data}
			columns={columns.concat(customColums || [])}
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
			mobileColumns={mobileCollumns || defaultMobileColumns}
			desktopColumns={desktopCollumns}
			onlyColumns={onlyColumns || []}
		/>
	)
}
