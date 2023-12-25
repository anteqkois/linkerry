import { connectorsTag } from '@market-connector/connectors-framework'
import { HTMLAttributes } from 'react'
import { DataTable } from '../../../../shared/components/table/Table'
import { columns } from '../../../connectors-metadata/table/defaultColumns'
import { useConnectorMetadataClientQuery } from '../../../connectors-metadata/useConnectorsMetadataQuery'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

// export const SelectTrigger = ({}: SelectTriggerProps) => {
export const SelectTrigger = () => {
  const { data } = useConnectorMetadataClientQuery()
  // const {} = useEditor()

  return (
    <div>
      <DataTable
        getRowId={(row) => row._id}
        onClickRow={(row) => console.log(row.id)}
        data={data || []}
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
        onlyColumns={['logoUrl', 'displayName']}
        clickable
      />
    </div>
  )
}
