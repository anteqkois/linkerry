import { HTMLAttributes } from 'react'
import { useClientQuery } from '../../../libs/react-query'
import { DataTable } from '../../../shared/components/Table/Table'
import { columns } from '../../flows/flow-runs/defaultColumns'
import { flowRunQueryConfig } from '../../flows/flow-runs/query-config'
import { useEditor } from '../useEditor'

export interface FlowRunsListProps extends HTMLAttributes<HTMLElement> {}

export const FlowRunsListPanel = () => {
  const { flow, onSelectFlowRun } = useEditor()
  const { data } = useClientQuery(flowRunQueryConfig.getMany({ flowId: flow._id }))

  // const handleSelectFlowRun = async (row: Row<FlowRun>) => {
  // 	// onSelectFlowRun()
  // 	// await handleSelectTriggerConnector(row.original)
  // }

  return (
    <div className="p-1">
      <DataTable
        getRowId={(row) => row._id}
        // onClickRow={handleSelectFlowRun}
        data={data}
        columns={columns}
        meta={{ onSelectFlowRun }}
        // filterAccessor=""
        // chooseFilters={[
        // 	{
        // 		accessor: 'tags',
        // 		title: 'Tags',
        // 		options: connectorTag.map((tag) => ({
        // 			label: tag,
        // 			value: tag,
        // 		})),
        // 	},
        // ]}
        // onlyColumns={['logoUrl', 'displayName']}
        clickable
      />
    </div>
  )
}
