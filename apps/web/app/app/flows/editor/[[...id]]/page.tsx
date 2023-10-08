'use client'

import { useAsync } from '@react-hookz/web'
import { useEffect } from 'react'
import { Edge } from 'reactflow'
import { CustomNode, Editor, TriggerNodeProps } from '../../../../../modules/editor'
import { AddNode } from '../../../../../modules/editor/nodes/components/AddNode'
import { TriggerNodeFactory } from '../../../../../modules/editor/nodes/components/nodeFactory'
// import { LocalStorageKeys } from '../../../../../types'
import { FlowVersion } from '@market-connector/shared'
import { useRouter } from 'next/navigation'
import { TriggerNodeElement } from '../../../../../modules/editor/nodes/components/TriggerNode'
import { FlowApi } from '../../../../../modules/flows/api'

const nodeTypes = {
  TriggerNode: TriggerNodeElement,
  AddNode: AddNode,
}

const renderFlow = (flowVersion: FlowVersion) => {
  const nodes: CustomNode[] = []
  const edges: Edge[] = []

  const triggerNode: TriggerNodeProps = TriggerNodeFactory({ trigger: flowVersion.triggers[0] })
  nodes.push(triggerNode)

  return { nodes, edges }
}

export default function Page({ params }: { params: { id: string } }) {
  // const { value, remove } = useLocalStorageValue<CustomNode[]>(LocalStorageKeys.StrategyCache)
  const { push } = useRouter()

  const [initialData, actions] = useAsync<{ initialNodes: CustomNode[]; initialEdges: Edge[] }>(async () => {
    const id = params?.id?.[0]

    // Fetch and render if exists
    if (id) {
      const { data } = await FlowApi.get(id)
      if (data && data._id === id) {
        const { nodes, edges } = renderFlow(data.version)
        return { initialNodes: nodes, initialEdges: edges }
      }
    }

    // Create new flow
    const { data } = await FlowApi.create()
    push(`/app/flows/editor/${data._id}`)

    return {
      initialNodes: [TriggerNodeFactory({ trigger: data.version.triggers[0] })],
      initialEdges: [],
    }
  })

  useEffect(() => {
    actions.execute()
    // Clean cache
    // return remove()
  }, [actions])

  return (
    <Editor
      initalData={{ edges: initialData.result?.initialEdges ?? [], nodes: initialData.result?.initialNodes ?? [] }}
      nodeTypes={nodeTypes}
      mode="production"
      limits={undefined}
      cache={{ saveState: undefined }}
    />
  )
}
