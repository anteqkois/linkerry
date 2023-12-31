'use client'

import { useCallback, useEffect } from 'react'
import { Edge } from 'reactflow'
import { CustomNode, Editor, useEditor } from '../../../../../modules/editor'
import { selectTriggerNodeFactory, triggerNodeFactory } from '../../../../../modules/editor/nodes/components/nodeFactory'
// import { LocalStorageKeys } from '../../../../../types'
import { ConnectorMetadataSummary } from '@market-connector/connectors-framework'
import { Flow, FlowVersion, TriggerType } from '@market-connector/shared'
import { useRouter } from 'next/navigation'
import { useClientQuery } from '../../../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../../../../modules/connectors-metadata/api/query-configs'
import { FlowApi } from '../../../../../modules/flows/api'

const mockFlowVersion: Flow = {
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
  const { loadFlow, setFlow, setEdges, setNodes } = useEditor()
  const { push } = useRouter()

  const initEditor = useCallback(async () => {
    if (!connectorsMetadata?.length) throw new Error('Can not retrive connectors metadata')
    const id = params?.id?.[0]

    // Fetch and render if exists
    if (id) {
      const flow = await loadFlow(id)
      if (flow) {
        const { nodes, edges } = renderFlow(flow.version, connectorsMetadata)
        setNodes(nodes)
        setEdges(edges)
        return
      }
    }
    // Create new flow
    const { data } = await FlowApi.create()
    setFlow(data)

    push(`/app/flows/editor/${data._id}`)

    setNodes([selectTriggerNodeFactory({ trigger: data.version.triggers[0] })])
    setEdges([])
  }, [params.id, connectorsMetadata])

  useEffect(() => {
    if (status !== 'success') return
    ;(async () => {
      await initEditor()
    })()
  }, [status])

  return <Editor mode="production" limits={undefined} cache={{ saveState: undefined }} />
}
