import { ConnectorMetadata } from '@market-connector/connectors-framework'
import { HTMLAttributes } from 'react'
import { DataTable } from '../../../shared/components/Table/DataTable'
import { columns } from './columns'

export interface ConnectorsTableProps extends HTMLAttributes<HTMLElement> {
  data: ConnectorMetadata[]
}

export const ConnectorsTable = ({data}:ConnectorsTableProps) => {
  return <DataTable data={data} columns={columns} />
}
