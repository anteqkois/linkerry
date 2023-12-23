import { ConnectorMetadata, connectorsTag } from '@market-connector/connectors-framework'
import { HTMLAttributes } from 'react'
import { DataTable } from '../../../shared/components/Table/Table'
import { columns } from './columns'

export interface ConnectorsTableProps extends HTMLAttributes<HTMLElement> {
  data: ConnectorMetadata[]
}

export const ConnectorsTable = ({ data }: ConnectorsTableProps) => {
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
      mobileHiddenColumns={['actions', 'description', 'triggers', 'version', 'buttons']}
    />
  )
}
