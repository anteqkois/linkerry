'use client'

import { ConnectorMetadata, connectorsTag } from '@market-connector/connectors-framework'
import { HTMLAttributes } from 'react'
import { DataTable } from '../../../shared/components/Table/Table'
import { useConnectorMetadataClientQuery } from '../useConnectorsMetadataQuery'
import { columns } from './columns'

type ColumnKey = keyof ConnectorMetadata | 'buttons'

export interface ConnectorsTableProps extends HTMLAttributes<HTMLElement> {
  collumns?: ColumnKey[]
  mobileCollumns?: ColumnKey[]
  desktopCollumns?: ColumnKey[]
}

const defaultMobileColumns: ColumnKey[] = ['logoUrl', 'displayName', 'tags']

export const ConnectorsTable = ({ collumns, mobileCollumns, desktopCollumns }: ConnectorsTableProps) => {
  const { data } = useConnectorMetadataClientQuery()

  return (
    <DataTable
      data={data}
      columns={columns}
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
      onlyColumns={collumns || []}
    />
  )
}
