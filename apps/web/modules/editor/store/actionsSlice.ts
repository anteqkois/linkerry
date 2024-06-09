import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import {
  Action,
  ActionConnector,
  ActionType,
  CustomError,
  DeepPartial,
  ErrorCode,
  FlowOperationType,
  QuotaError,
  RunActionResponse,
  assertNotNullOrUndefined,
  deepMerge,
  flowHelper,
  isAction,
  isConnectorAction,
  isTrigger,
} from '@linkerry/shared'
import { FlowApi, StepApi } from '../../flows'
import { actionNodeFactory, nodeConfigs } from '../common/nodeFactory'
import { defaultEdgeFactory, generateEdgeId } from '../edges/edgesFactory'
import { ActionsSlice, CreateSlice, FlowOperationRunnType } from './types'

export const createActionSlice: CreateSlice<ActionsSlice> = (set, get) => ({
  // ACTIONS
  editedAction: null,
  setEditedAction: (action: Action) => {
    const { setRightDrawer } = get()

    setRightDrawer('action_connector')
    set({
      editedTrigger: null,
      editedAction: action,
      showRightDrawer: true,
    })
  },
  onClickSelectAction(nodeIdName: string) {
    const { setRightDrawer, flow } = get()
    setRightDrawer('select_action')
    const actionName = `action_${flow.version.stepsCount + 1}`
    set({
      showRightDrawer: true,
      editStepMetadata: {
        parentNodeName: nodeIdName,
        actionName,
      },
    })
  },
  async handleSelectActionConnector(connectorMetadata: ConnectorMetadataSummary) {
    const { getNodeById, editStepMetadata, setRightDrawer, patchNode, addNode, flow, setFlow, setEditedAction, addEdge, limits } = get()
    if (flow.version.stepsCount >= limits.flowSteps)
      throw new QuotaError('flowSteps', {
        flowSteps: `${flow.version.stepsCount} / ${limits.flowSteps}`,
      })

    assertNotNullOrUndefined(editStepMetadata?.actionName, 'editStepMetadata.actionName')

    const action: ActionConnector = {
      name: editStepMetadata.actionName,
      displayName: connectorMetadata.displayName,
      type: ActionType.CONNECTOR,
      valid: false,
      settings: {
        // errorHandlingOptions:{},
        packageType: connectorMetadata.packageType,
        connectorName: connectorMetadata.name,
        connectorVersion: connectorMetadata.version,
        connectorType: connectorMetadata.connectorType,
        actionName: '',
        input: {},
        inputUiInfo: {},
      },
      nextActionName: '',
    }

    try {
      set({
        flowOperationRunning: FlowOperationRunnType.RUN,
      })

      const { data } = await FlowApi.operation(flow._id, {
        type: FlowOperationType.ADD_ACTION,
        flowVersionId: flow.version._id,
        request: {
          action,
          parentStepName: editStepMetadata?.parentNodeName,
        },
      })

      const parentNode = getNodeById(editStepMetadata.parentNodeName)
      assertNotNullOrUndefined(parentNode, 'parentNode')

      // add action name to parent step
      if ('action' in parentNode.data)
        patchNode(parentNode.id, { data: { ...parentNode.data, action: { ...parentNode.data.action, nextActionName: editStepMetadata.actionName } } })
      else if ('trigger' in parentNode.data)
        patchNode(parentNode.id, {
          data: { ...parentNode.data, trigger: { ...parentNode.data.trigger, nextActionName: editStepMetadata.actionName } },
        })

      const newActionNode = actionNodeFactory({
        action,
        connectorMetadata,
        position: {
          x: parentNode.position.x,
          y: parentNode.position.y + nodeConfigs.BaseNode.height + nodeConfigs.gap.y,
        },
      })

      setRightDrawer('action_connector')
      addNode(newActionNode)
      addEdge(
        defaultEdgeFactory({
          sourceNodeId: editStepMetadata?.parentNodeName,
          targetNodeId: newActionNode.id,
        }),
      )
      setFlow(data)
      setEditedAction(action)
    } finally {
      set({
        flowOperationRunning: null,
      })
    }
  },
  async patchEditedAction(update: DeepPartial<Action>) {
    const { editedAction, flow, setFlow, patchNode } = get()
    assertNotNullOrUndefined(editedAction, 'editedAction')

    const newAction = deepMerge<Action>(editedAction, update)
    if (JSON.stringify(newAction) === JSON.stringify(editedAction)) return console.debug('Skip action update, data after merge is the same')
    set({
      flowOperationRunning: FlowOperationRunnType.RUN,
    })

    try {
      const { data } = await FlowApi.operation(flow._id, {
        type: FlowOperationType.UPDATE_ACTION,
        flowVersionId: flow.version._id,
        request: newAction,
      })

      patchNode(newAction.name, { data: { action: newAction } })

      setFlow(data)
      set({
        editedAction: newAction,
      })
    } finally {
      set({
        flowOperationRunning: null,
      })
    }
  },
  async updateEditedAction(newAction: Action) {
    const { flow, setFlow, patchNode } = get()

    set({
      flowOperationRunning: FlowOperationRunnType.RUN,
    })

    try {
      const { data } = await FlowApi.operation(flow._id, {
        type: FlowOperationType.UPDATE_ACTION,
        flowVersionId: flow.version._id,
        request: newAction,
      })
      assertNotNullOrUndefined(data, 'newFlow')

      patchNode(newAction.name, { data: { action: newAction } })

      setFlow(data)
      set({
        editedAction: newAction,
      })
    } finally {
      set({
        flowOperationRunning: null,
      })
    }
  },
  deleteAction: async (actionName: string) => {
    const { flow, setFlow, deleteNode, setShowRightDrawer, patchNode, deleteEdge } = get()

    set({
      flowOperationRunning: FlowOperationRunnType.RUN,
    })

    try {
      const { data } = await FlowApi.operation(flow._id, {
        type: FlowOperationType.DELETE_ACTION,
        flowVersionId: flow.version._id,
        request: {
          name: actionName,
        },
      })
      assertNotNullOrUndefined(data, 'newFlow')

      const parentSteps = flowHelper.getParentSteps(flow.version, actionName)

      for (const step of parentSteps) {
        if (isTrigger(step))
          patchNode(step.name, {
            data: {
              trigger: {
                nextActionName: '',
              },
            },
          })
        else if (isAction(step))
          patchNode(step.name, {
            data: {
              action: {
                nextActionName: '',
              },
            },
          })

        deleteEdge(generateEdgeId(step.name, actionName))
      }

      setShowRightDrawer(false)
      deleteNode(actionName)
      setFlow(data)
    } finally {
      set({
        flowOperationRunning: null,
      })
    }
  },
  testAction: async () => {
    const { flow, setFlow, patchNode, editedAction } = get()
    set({
      flowOperationRunning: FlowOperationRunnType.RUN,
    })

    try {
      if (!editedAction || !isConnectorAction(editedAction))
        throw new CustomError('Invalid action data', ErrorCode.INVALID_TYPE, {
          editedAction,
        })

      assertNotNullOrUndefined(editedAction, 'editedAction')
      let testResult: RunActionResponse | undefined = undefined

      testResult = (
        await StepApi.run({
          actionName: editedAction.name,
          flowVersionId: flow.version._id,
        })
      ).data
      assertNotNullOrUndefined(testResult, 'testResult')

      if (testResult.success) {
        const action = flowHelper.getAction(testResult.flowVersion, editedAction.name)
        if (!action || !isConnectorAction(action))
          throw new CustomError(`Can not find action`, ErrorCode.ENTITY_NOT_FOUND, {
            action,
          })

        patchNode(action.name, {
          data: {
            action,
          },
        })
        set({ editedAction: action })
        setFlow({ ...flow, version: testResult.flowVersion })

        const { flowVersion, ...response } = testResult
        return response
      }
      return testResult
    } finally {
      set({
        flowOperationRunning: null,
      })
    }
  },
})
