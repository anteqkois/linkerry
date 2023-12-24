import { connectorsTag } from '@market-connector/connectors-framework'
import { H5 } from '@market-connector/ui-components/server'
import { HTMLAttributes } from 'react'
import { DataTable } from '../../../shared/components/Table/Table'
import { columns } from '../../connectors-metadata/Table/defaultColumns'
import { useConnectorMetadataClientQuery } from '../../connectors-metadata/useConnectorsMetadataQuery'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

// export const SelectTrigger = ({}: SelectTriggerProps) => {
export const SelectTrigger = () => {
  const { data } = useConnectorMetadataClientQuery()
  // const {} = useEditor()

  return (
    <div>
      <H5 className="pb-3">Select Trigger</H5>
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
      />
    </div>
  )
}
