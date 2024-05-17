import { CustomError, ErrorCode, StepOutput, StepOutputStatus, assertNotNullOrUndefined, isStepBaseSettings } from '@linkerry/shared'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@linkerry/ui-components/client'
import { P } from '@linkerry/ui-components/server'
import { useQueries } from '@tanstack/react-query'
import { useCallback, useMemo, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useClientQuery } from '../../../libs/react-query'
import { CodeEditor } from '../../../shared/components/Code/CodeEditor'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { flowRunQueryConfig } from '../../flows/flow-runs/query-config'
import { flowVersionQueryConfig } from '../../flows/flows-version/query-config'
import { useEditor } from '../useEditor'
import { StepItem } from './StepItem'

export const FlowRunPanel = () => {
  const { selectedFlowRunId } = useEditor()
  const [selectedResult, setSelectedResult] = useState<StepOutput>()
  assertNotNullOrUndefined(selectedFlowRunId, 'selectedFlowRunId')
  const [resultInputPanelHeight, setResultInputPanelHeight] = useState(35)
  const [resultOutputPanelHeight, setResultOutputPanelHeight] = useState(35)

  const {
    data: flowRun,
    isFetched: isFetchedFlowRun,
    isLoading: isLoadingFlowRun,
    error: errorFlowRun,
  } = useClientQuery({
    ...flowRunQueryConfig.getOne({
      flowRunId: selectedFlowRunId,
    }),
  })

  const {
    data: flowVersion,
    isFetched: isFetchedFlowVersion,
    isLoading: isLoadingFlowVersion,
    error: errorFlowVersion,
  } = useClientQuery({
    ...flowVersionQueryConfig.getOne({
      flowVersionId: flowRun?.flowVersionId ?? '',
    }),
    enabled: isFetchedFlowRun && !!flowRun?.flowVersionId,
  })

  const connectorsMetadata = useQueries({
    queries: flowVersion
      ? [
          ...Object.values(flowVersion.triggers).map((trigger) => {
            if (!isStepBaseSettings(trigger.settings)) throw new CustomError(`invalid settings for step ${trigger.name}`, ErrorCode.INVALID_TYPE)
            return connectorsMetadataQueryConfig.getOne({
              connectorName: trigger.settings.connectorName,
              connectorVersion: trigger.settings.connectorVersion,
            })
          }),
          ...Object.values(flowVersion.actions).map((action) => {
            if (!isStepBaseSettings(action.settings)) throw new CustomError(`invalid settings for step ${action.name}`, ErrorCode.INVALID_TYPE)
            return connectorsMetadataQueryConfig.getOne({
              connectorName: action.settings.connectorName,
              connectorVersion: action.settings.connectorVersion,
            })
          }),
        ]
      : [],
  })

  const steps = useMemo(() => {
    if (isLoadingFlowRun || isLoadingFlowVersion || connectorsMetadata.some((result) => result.isLoading)) return []
    assertNotNullOrUndefined(flowRun?.steps, 'flowRun?.steps')
    return Object.entries(flowRun?.steps).map(([stepName, result]) => {
      if (stepName.startsWith('trigger')) {
        const trigger = flowVersion?.triggers.find((trigger) => trigger.name === stepName)
        if (!isStepBaseSettings(trigger?.settings)) throw new CustomError(`invalid settings for step ${trigger?.name}`, ErrorCode.INVALID_TYPE)
        const connectorMetadata = connectorsMetadata.find((result) => result.data?.name === trigger.settings.connectorName)
        assertNotNullOrUndefined(connectorMetadata?.data, 'connectorMetadata')

        return {
          step: trigger,
          result,
          connectorMetadata: connectorMetadata.data,
        }
      } else if (stepName.startsWith('action')) {
        const action = flowVersion?.actions.find((action) => action.name === stepName)
        if (!isStepBaseSettings(action?.settings)) throw new CustomError(`invalid settings for step ${action?.name}`, ErrorCode.INVALID_TYPE)
        const connectorMetadata = connectorsMetadata.find((result) => result.data?.name === action.settings.connectorName)
        assertNotNullOrUndefined(connectorMetadata?.data, 'connectorMetadata')

        return {
          step: action,
          result,
          connectorMetadata: connectorMetadata.data,
        }
      } else throw new CustomError(`Can not infer step type`, ErrorCode.INVALID_TYPE, steps)
    })
  }, [isLoadingFlowRun, isLoadingFlowVersion, connectorsMetadata.some((result) => result.isLoading)])

  const onSelectStep = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex]
      setSelectedResult(step.result)
    },
    [steps],
  )

  if (isLoadingFlowRun || isLoadingFlowVersion) return <Spinner />
  if (errorFlowRun) return <ErrorInfo errorObject={errorFlowRun} />
  if (errorFlowVersion) return <ErrorInfo errorObject={errorFlowVersion} />
  if (!flowRun) return <P>Can not find flow run details</P>
  if (!flowVersion) return <P>Can not find flow version details</P>
  if (connectorsMetadata.some((result) => result.isError)) return <ErrorInfo message="Can not fetch connectors details" />

  return (
    <ResizablePanelGroup direction="vertical" className="max-h-screen pt-2">
      <ResizablePanel defaultSize={30}>
        <div className="max-h-full overflow-scroll">
          {steps.map((stepData, index) => (
            <StepItem {...stepData} stepIndex={index} key={stepData.step.name} onSelectStep={onSelectStep} />
          ))}
        </div>
      </ResizablePanel>
      {selectedResult && (
        <>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={5} maxSize={80} onResize={(size) => setResultInputPanelHeight(size)} className="p-1">
            <CodeEditor
              className="max-h-full overflow-scroll"
              value={prepareCodeMirrorValue(selectedResult.input)}
              // heightVh={resultInputPanelHeight} substractPx={40}
              title="Input"
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={35} minSize={5} maxSize={80} onResize={(size) => setResultOutputPanelHeight(size)} className="p-1">
            <CodeEditor
              className="max-h-full overflow-scroll"
              value={prepareCodeMirrorValue(
                selectedResult.status === StepOutputStatus.SUCCEEDED ? selectedResult.output : selectedResult.errorMessage,
              )}
              // heightVh={resultOutputPanelHeight}
              // substractPx={100}
              title="Output"
            />
          </ResizablePanel>
        </>
      )}
    </ResizablePanelGroup>
  )
}
