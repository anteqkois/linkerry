'use client'

import { useAsync } from '@react-hookz/web'
import { useEffect } from 'react'
import { Edge } from 'reactflow'
import { CustomNode, Editor } from '../../../../../modules/editor'
import { selectTriggerNodeFactory, triggerNodeFactory } from '../../../../../modules/editor/nodes/components/nodeFactory'
// import { LocalStorageKeys } from '../../../../../types'
import { ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { Flow, FlowVersion, TriggerType } from '@market-connector/shared'
import { useRouter } from 'next/navigation'
import { useClientQuery } from '../../../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../../../../modules/connectors-metadata/api/query-configs'
import { FlowApi } from '../../../../../modules/flows/api'

const mockFlowVersion : Flow = {
  _id: '658b054d1908ebfe99ba298e',
  user: '000000000000000000000000',
  status: 'Unpublished',
  version: {
    _id: '658b054d1908ebfe99ba2990',
    displayName: 'Untitled',
    stepsCount: 1,
    flow: '658b054d1908ebfe99ba298e',
    valid: false,
    state: 'Draft',
    triggers: [
      {
        displayName: 'Coingecko',
        id: '658b054d1908ebfe99ba298f',
        type: 'Connector',
        valid: false,
        settings: {
          connectorId: '65872bff736a059c0a4642e2',
          connectorName: '@market-connector/coingecko',
          input: {},
          connectorVersion: '0.0.1',
          sampleData: {
            currentSelectedData: {},
            lastTestDate: '2023-12-26T17:53:54.579Z',
          },
        },
      },
    ],
    createdAt: '2023-12-26T16:54:37.487Z',
    updatedAt: '2023-12-26T16:54:37.487Z',
    __v: 0,
  },
  createdAt: '2023-12-26T16:54:37.686Z',
  updatedAt: '2023-12-26T16:54:37.686Z',
  __v: 0,
} as unknown as Flow

const renderFlow = (flowVersion: FlowVersion, connectorsMetadata: ConnectorMetadataSummary[]) => {
  const nodes: CustomNode[] = []
  const edges: Edge[] = []

  for (const trigger of flowVersion.triggers) {
    switch (trigger.type) {
      case TriggerType.Empty:
        nodes.push(selectTriggerNodeFactory({ trigger }))
        break
      case TriggerType.Connector: {
        const connectorMetadata = connectorsMetadata.find((metadata) => trigger.settings.connectorName === metadata.name)
        if (!connectorMetadata) throw new Error(`Can not retrive trigger connector metadata: ${trigger.settings.connectorName}`)
        nodes.push(triggerNodeFactory({ trigger, connectorMetadata }))
        break
      }
      default:
        throw new Error(`Can not find trigger type: ${trigger}`)
    }
  }

  return { nodes, edges }
}

export default function Page({ params }: { params: { id: string } }) {
  const { data: connectorsMetadata, status } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
  // const { value, remove } = useLocalStorageValue<CustomNode[]>(LocalStorageKeys.StrategyCache)
  const { push } = useRouter()

  const [initialData, actions] = useAsync<{ initialNodes: CustomNode[]; initialEdges: Edge[] }>(async () => {
    if (!connectorsMetadata?.length) throw new Error('Can not retrive connectors metadata')
    const id = params?.id?.[0]

    // Fetch and render if exists
    if (id) {
      // const { data } = await FlowApi.get(id)
      // if (data && data._id === id) {
      //   const { nodes, edges } = renderFlow(data.version, connectorsMetadata)
      //   return { initialNodes: nodes, initialEdges: edges }
      // }
        const { nodes, edges } = renderFlow(mockFlowVersion.version, connectorsMetadata)
        return { initialNodes: nodes, initialEdges: edges }

    }
    // Create new flow
    const { data } = await FlowApi.create()
    push(`/app/flows/editor/${data._id}`)

    return {
      initialNodes: [selectTriggerNodeFactory({ trigger: data.version.triggers[0] })],
      initialEdges: [],
    }
  })

  useEffect(() => {
    if (status === 'success') actions.execute()
    // Clean cache
    // return remove()
  }, [actions, status])

  return (
    <Editor
      initalData={{ edges: initialData.result?.initialEdges ?? [], nodes: initialData.result?.initialNodes ?? [] }}
      mode="production"
      limits={undefined}
      cache={{ saveState: undefined }}
    />
  )
}
