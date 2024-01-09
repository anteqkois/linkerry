import { ConnectorMetadataSummary, connectorTag } from '@market-connector/connectors-framework'
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

export const SelectTriggerDrawer = () => {
  const { data } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
  const { updateNode, editedTrigger, setDrawer, setEditedTrigger, updateEditedTrigger } = useEditor()

  const handleSelectTrigger = async (row: Row<ConnectorMetadataSummary>) => {
    if (!editedTrigger) throw new Error('Can not retrive editTrigger data')

    const newTrigger: TriggerConnector = {
      name: editedTrigger.name,
      displayName: row.original.displayName,
      type: TriggerType.Connector,
      valid: false,
      settings: {
        connectorName: row.original.name,
        connectorVersion: row.original.version,
				connectorVisibility: row.original.visibility,
				triggerName: '',
        input: {},
				inputUiInfo:{}
      },
    }

    await updateEditedTrigger(newTrigger)
    setEditedTrigger(newTrigger)
    updateNode(editedTrigger.name, triggerNodeFactory({ trigger: newTrigger, connectorMetadata: row.original }))
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
