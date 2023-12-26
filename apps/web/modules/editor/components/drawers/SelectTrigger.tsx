import { ConnectorMetadataSummary, connectorsTag } from '@market-connector/connectors-framework'
import { TriggerConnector, TriggerType } from '@market-connector/shared'
import { Row } from '@tanstack/react-table'
import { HTMLAttributes } from 'react'
import { useClientQuery } from '../../../../libs/react-query'
import { DataTable } from '../../../../shared/components/table/Table'
import { connectorsMetadataQueryConfig } from '../../../connectors-metadata/api/query-configs'
import { columns } from '../../../connectors-metadata/table/defaultColumns'
import { triggerNodeFactory } from '../../nodes/components/nodeFactory'
import { useEditor } from '../../useEditor'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

// export const SelectTrigger = ({}: SelectTriggerProps) => {
export const SelectTriggerDrawer = () => {
  const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
  const { updateNode, editedTrigger, setDrawer, setEditedTrigger } = useEditor()

  const handleSelectTrigger = (row: Row<ConnectorMetadataSummary>) => {
    if (!editedTrigger) throw new Error('Can not retrive editTrigger data')

    const triggerConector: TriggerConnector = {
      displayName: row.original.displayName,
      id: editedTrigger.id,
      type: TriggerType.Connector,
      valid: false,
      settings: {
        connectorId: row.original._id,
        connectorName: row.original.name,
        input: {},
        connectorVersion: row.original.version,
        sampleData: { currentSelectedData: {}, lastTestDate: new Date() },
      },
    }

    setEditedTrigger(triggerConector)
    updateNode(editedTrigger.id, triggerNodeFactory({ trigger: triggerConector, connectorMetadata: row.original }))
    setDrawer('trigger')
  }

  return (
    <div>
      <DataTable
        getRowId={(row) => row._id}
        onClickRow={handleSelectTrigger}
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
