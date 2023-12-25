'use client'

import { ConnectorMetadata, connectorsTag } from '@market-connector/connectors-framework'
import { ColumnDef } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import { DataTable } from '../../../shared/components/table/Table'
import { useConnectorMetadataClientQuery } from '../useConnectorsMetadataQuery'
import { columns } from './defaultColumns'

type ColumnKey = keyof ConnectorMetadata | 'buttons'

export interface ConnectorsTableProps extends HTMLAttributes<HTMLElement> {
  onlyColumns?: ColumnKey[]
  customColums: ColumnDef<ConnectorMetadata>[]
  mobileCollumns?: ColumnKey[]
  desktopCollumns?: ColumnKey[]
}

const defaultMobileColumns: ColumnKey[] = ['logoUrl', 'displayName', 'tags']

export const ConnectorsTable = ({ onlyColumns, mobileCollumns, desktopCollumns, customColums }: ConnectorsTableProps) => {
  const { data } = useConnectorMetadataClientQuery()

  return (
    <DataTable
      data={data}
      columns={columns.concat(customColums)}
      filterAccessor="displayName"
      chooseFilters={[
        {
          accessor: 'tags',
          title: 'Tags',
          options: connectorsTag.map((tag) => ({
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
