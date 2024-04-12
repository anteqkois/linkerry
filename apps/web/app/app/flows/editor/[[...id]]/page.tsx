'use client'

import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { ActionType, CustomError, ErrorCode, FlowVersion, TriggerType, assertNotNullOrUndefined, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect } from 'react'
import { Edge } from 'reactflow'
import { useClientQuery } from '../../../../../libs/react-query'
import { useSubscriptions } from '../../../../../modules/billing/subscriptions/useSubscriptions'
import { useReachLimitDialog } from '../../../../../modules/billing/useReachLimitDialog'
import { CustomNode, Editor, useEditor } from '../../../../../modules/editor'
import {
	actionNodeFactory,
	nodeConfigs,
	selectTriggerNodeFactory,
	testFlowNodeFactory,
	triggerNodeFactory,
} from '../../../../../modules/editor/common/nodeFactory'
import { defaultEdgeFactory } from '../../../../../modules/editor/edges/edgesFactory'
import { connectorsMetadataQueryConfig } from '../../../../../modules/flows/connectors/api/query-configs'
import { FlowApi } from '../../../../../modules/flows/flows/api'
import { ErrorInfo, Spinner } from '../../../../../shared/components'

const renderFlow = (flowVersion: FlowVersion, connectorsMetadata: ConnectorMetadataSummary[]) => {
	const nodes: CustomNode[] = [
		testFlowNodeFactory({
			position: {
				x: nodeConfigs.BaseNode.width / 2 - nodeConfigs.TestFlowNode.width / 2,
				y: -60,
			},
		}),
	]
	const edges: Edge[] = []

	let parentNode: Pick<CustomNode, 'position' | 'id'> & {
		height: number
		width: number
	} = {
		id: '',
		position: {
			x: 0,
			y: 0,
		},
		height: nodeConfigs.BaseNode.height,
		width: nodeConfigs.BaseNode.width,
	}

	for (const trigger of flowVersion.triggers) {
		switch (trigger.type) {
			case TriggerType.EMPTY:
				nodes.push(selectTriggerNodeFactory({ trigger }))
				parentNode = nodes[nodes.length - 1]
				break
			case TriggerType.CONNECTOR: {
				const connectorMetadata = connectorsMetadata.find((metadata) => trigger.settings.connectorName === metadata.name)
				assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata')
				nodes.push(triggerNodeFactory({ trigger, connectorMetadata }))
				parentNode = nodes[nodes.length - 1]
				break
			}
			default:
				throw new Error(`Can not find trigger type: ${trigger}`)
		}
	}

	assertNotNullOrUndefined(parentNode, 'parentNode')

	for (const action of flowVersion.actions) {
		switch (action.type) {
			case ActionType.BRANCH:
				// case ActionType.LOOP_ON_ITEMS:
				// case ActionType.MERGE_BRANCH:
				throw new CustomError(`Unsuported action type`, ErrorCode.INVALID_TYPE, {
					action,
				})
			case ActionType.CONNECTOR: {
				const connectorMetadata = connectorsMetadata.find((metadata) => action.settings.connectorName === metadata.name)
				assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata')

				const newNode = actionNodeFactory({
					action,
					connectorMetadata,
					position: {
						x: parentNode.position.x,
						y: parentNode.position.y + parentNode.height + nodeConfigs.gap.y,
					},
				})
				nodes.push(newNode)

				edges.push(
					defaultEdgeFactory({
						sourceNodeId: parentNode.id,
						targetNodeId: newNode.id,
					}),
				)

				parentNode = newNode
			}
		}
	}

	return { nodes, edges }
}

export default function Page({ params }: { params: { id: string } }) {
	const { data: connectorsMetadata, status } = useClientQuery(connectorsMetadataQueryConfig.getSummaryMany())
	const { loadFlow, setFlow, setEdges, setNodes } = useEditor()
	const { toast } = useToast()
	const { isQuotaErrorThenShowDialog } = useReachLimitDialog()
	const { currentPlanConfiguration, subscriptionsStatus, subscriptionsError } = useSubscriptions()
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
		try {
			const { data } = await FlowApi.create()
			setFlow(data)

			push(`/app/flows/editor/${data._id}`)

			setNodes([selectTriggerNodeFactory({ trigger: data.version.triggers[0] })])
			setEdges([])
		} catch (error) {
			let errorDescription = ''
			if (isCustomHttpExceptionAxios(error)) {
				if (isQuotaErrorThenShowDialog(error.response.data)) return
				else errorDescription = error.response.data.message
			} else errorDescription = 'We can not retrive error message. Please inform our Team'

			toast({
				title: 'Can not create new Flow',
				description: errorDescription,
			})
		}
	}, [params.id, connectorsMetadata])

	useEffect(() => {
		if (status !== 'success') return
		;(async () => {
			await initEditor()
		})()
	}, [status])

	if (subscriptionsStatus === 'pending') return <Spinner />
	if (subscriptionsStatus === 'error') return <ErrorInfo errorObject={subscriptionsError} />
	if (!currentPlanConfiguration) return <ErrorInfo message="Can not retrive yor plan configuration" />

	return <Editor mode="production" limits={currentPlanConfiguration} cache={{ saveState: undefined }} />
}
