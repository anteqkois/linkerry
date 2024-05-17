import { ErrorCodeQuota, FlowRunStatus, isCustomWebSocketException, isQuotaErrorCode } from '@linkerry/shared'
import { useToast } from '@linkerry/ui-components/client'
import { Card, H5 } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes, useCallback, useMemo } from 'react'
import { useReachLimitDialog } from '../../billing/useReachLimitDialog'
import { nodeConfigs } from '../common/nodeFactory'
import { useEditor } from '../useEditor'

const testFlowVariants = cva('flex-center border-2 rounded-3xl', {
  variants: {
    valid: {
      true: 'text-primary bg-primary/20 border-primary/50 cursor-pointer',
      false: 'text-warning bg-warning-foreground border-warning/50 border-dashed cursor-not-allowed',
    },
  },
})

interface TestFlowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, VariantProps<typeof testFlowVariants> {}

export const TestFlowNodeElement = ({ onClick, className }: TestFlowProps) => {
  const { flow, testingFlowVersion, flowOperationRunning, testFlowVersion } = useEditor()
  const { showDialogBasedOnErrorCode } = useReachLimitDialog()
  const { toast } = useToast()
  const flowValidity = useMemo(() => {
    if (flowOperationRunning) return { invalid: true, message: 'Operation runs...' }
    else if (!flow.version.valid) return { invalid: true, message: 'Complete Flow' }
    else if (testingFlowVersion) return { invalid: true, message: 'Testing...' }
    else if (flow.version.stepsCount < 2) return { invalid: true, message: 'Min. 2 steps' }

    return { invalid: false }
  }, [flow.version.valid, testingFlowVersion, flowOperationRunning])

  const handleTestFlowVersion = useCallback(async () => {
    try {
      const flowRun = await testFlowVersion()

      switch (flowRun.status) {
        case FlowRunStatus.PAUSED:
          toast({
            title: 'Test Flow Was Paused',
            description: `Your test flow for ${flowRun.flowDisplayName} ran successfully, but was paused.`,
            variant: 'success',
          })
          break
        case FlowRunStatus.STOPPED:
          toast({
            title: 'Test Flow Stoped',
            description: `Your test flow for ${flowRun.flowDisplayName} was stopped.`,
            variant: 'success',
          })
          break
        case FlowRunStatus.SUCCEEDED:
          toast({
            title: 'Test Flow Success',
            description: `Your test flow for ${flowRun.flowDisplayName} ran successfully`,
            variant: 'success',
          })
          break
        case FlowRunStatus.FAILED:
          toast({
            title: 'Test Flow Failed',
            description: `Your test flow for ${flowRun.flowDisplayName} failed. Check flow run artifacts to fix issue.`,
            variant: 'destructive',
          })
          break
        case FlowRunStatus.INTERNAL_ERROR:
          toast({
            title: 'Test Flow Failed',
            description: `Your test flow for ${flowRun.flowDisplayName} failed. Check flow run artifacts to fix issue. It can be also interval error. If you do not find any errors, please contact with our Team`,
            variant: 'destructive',
          })
          break
        case FlowRunStatus.QUOTA_EXCEEDED_TASKS:
          showDialogBasedOnErrorCode(ErrorCodeQuota.QUOTA_EXCEEDED_TASKS)
          toast({
            title: 'Test Flow Exceeded Plan Limit',
            description: `Your test flow for ${flowRun.flowDisplayName} failed due to exceeding your task limit.`,
            variant: 'destructive',
          })
          break
        case FlowRunStatus.RUNNING:
        case FlowRunStatus.TIMEOUT:
          toast({
            title: 'Test Flow Timeout',
            description: `Your test flow for ${flowRun.flowDisplayName} was stoped due to timeout.`,
            variant: 'destructive',
          })
          break
        default:
          toast({
            title: `Test Flow ${flowRun.status}`,
            description: `Encounter unknwon flow run status`,
            variant: 'destructive',
          })
      }
    } catch (error: any) {
      if (isCustomWebSocketException(error)) {
        if (isQuotaErrorCode(error.code)) return showDialogBasedOnErrorCode(error.code)
        else
          toast({
            title: 'Test Flow Error',
            description: error.message,
            variant: 'destructive',
          })
      } else {
        console.error(error)
        toast({
          title: 'Test Flow Error',
          description: 'Unknwon error occurred',
          variant: 'destructive',
        })
      }
    }
  }, [])

  return (
    <Card
      className={cn(testFlowVariants({ valid: !flowValidity.invalid }), ``, className)}
      style={{
        width: `${nodeConfigs.TestFlowNode.width}px`,
        height: `${nodeConfigs.TestFlowNode.height}px`,
      }}
      onClick={onClick}
    >
      {/* <H5 onClick={handleTestFlowVersion}>{flowValidity.invalid ? flowValidity.message : 'Test Flow'}</H5> */}
      <H5 onClick={handleTestFlowVersion}>{flowValidity.invalid ? flowValidity.message : 'Run Once'}</H5>
    </Card>
  )
}
