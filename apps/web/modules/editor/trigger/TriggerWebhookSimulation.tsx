import { CustomError, ErrorCode, Id, assertNotNullOrUndefined, isConnectorTrigger } from '@linkerry/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@linkerry/ui-components/client'
import { Button, Icons, Muted, Small } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useRelativeTime } from '../../../libs/dayjs'
import { getBrowserQueryCllient, useClientQuery } from '../../../libs/react-query'
import { CodeEditor, ErrorInfo, Spinner, WarningInfo } from '../../../shared/components'
import { TriggerApi } from '../../flows/triggers/api'
import { GenerateTestDataButton } from '../steps/GenerateTestDataButton'
import { FlowOperationRunnType } from '../store'
import { useEditor } from '../useEditor'

export interface TriggerWebhookSimulationProps extends HTMLAttributes<HTMLElement> {
  triggerDisplayName: string
  panelSize: number
  disabled: boolean
  disabledMessage: string
  sampleData?: any
}

export const TriggerWebhookSimulation = ({ panelSize, disabled, disabledMessage, triggerDisplayName, sampleData }: TriggerWebhookSimulationProps) => {
  const { toast } = useToast()
  const {
    flow,
    editedTrigger,
    testWebhookTrigger,
    flowOperationRunning,
    patchEditedTriggerConnector,
    editedConnectorMetadata,
    cancelWebhookTrigger,
    webhookTriggerWatcherWorks,
  } = useEditor()
  const [errorMessage, setErrorMessage] = useState<string>('')
  assertNotNullOrUndefined(editedTrigger?.name, 'editedTrigger.name')
  if (!isConnectorTrigger(editedTrigger))
    throw new CustomError('Invalid trigger type, can not use other than ConnectorTrigger', ErrorCode.INVALID_TYPE, {
      editedTrigger,
    })

  const [record, setRecord] = useState('')
  const [selectedTriggerEventId, setSelectedTriggerEventId] = useState<string>()
  const { relativeTime, setInitialTime } = useRelativeTime()

  const { data, status, refetch } = useClientQuery({
    queryKey: ['trigger-events', editedTrigger.name],
    queryFn: async () => {
      const { data } = await TriggerApi.getTriggerEvents({
        flowId: flow._id,
        triggerName: editedTrigger.name,
      })
      return data
    },
  })

  const onChangeTriggerEvent = useCallback(
    async (newTriggerEventId: Id) => {
      if (!data) return
      setSelectedTriggerEventId(newTriggerEventId)
      const triggerEvent = data.find((event) => event._id === newTriggerEventId)
      assertNotNullOrUndefined(triggerEvent, 'triggerEvent')

      setRecord(prepareCodeMirrorValue(triggerEvent.payload))
      await patchEditedTriggerConnector({
        settings: {
          inputUiInfo: {
            currentSelectedData: triggerEvent.payload,
          },
        },
      })
    },
    [data],
  )

  const onSelectSampleData = useCallback(async () => {
    if (!sampleData)
      return toast({
        title: 'Can not retrive sample data',
        description: `We can not retrive sample data. Please inform our team about this incident.`,
        variant: 'destructive',
      })

    setRecord(prepareCodeMirrorValue(sampleData))
    await patchEditedTriggerConnector({
      settings: {
        inputUiInfo: {
          currentSelectedData: sampleData,
        },
      },
    })
  }, [sampleData])

  useEffect(() => {
    // remve trigger events when trigger changed
    setRecord('')
    refetch()
  }, [editedTrigger.settings.triggerName])

  useEffect(() => {
    if (status !== 'success') return

    if (!data?.length) {
      //  check if user selected sample data
      if (!editedTrigger.settings.inputUiInfo.currentSelectedData) return
      setRecord(prepareCodeMirrorValue(editedTrigger.settings.inputUiInfo.currentSelectedData))
    }

    if (!editedTrigger.settings.inputUiInfo.currentSelectedData || !editedTrigger.settings.inputUiInfo.lastTestDate) return

    setRecord(prepareCodeMirrorValue(editedTrigger.settings.inputUiInfo.currentSelectedData))
    setInitialTime(editedTrigger.settings.inputUiInfo.lastTestDate)
  }, [status])

  if (!editedTrigger) return <ErrorInfo message="Can not retrive editedTrigger" />
  if (status === 'pending') return <Spinner />

  const onClickTest = async () => {
    setErrorMessage('')

    try {
      const triggerEventsData = await testWebhookTrigger()
      if ('message' in triggerEventsData) {
        if (triggerEventsData.error) {
          return setErrorMessage(triggerEventsData.message)
        } else
          return toast({
            title: 'Stop Test Trigger Webhook',
            description: triggerEventsData.message,
            variant: 'default',
          })
      }

      const queryClient = getBrowserQueryCllient()
      queryClient.setQueryData(['trigger-events', editedTrigger.name], triggerEventsData)
      setRecord(prepareCodeMirrorValue(triggerEventsData[triggerEventsData.length - 1].payload))
      setSelectedTriggerEventId(triggerEventsData[triggerEventsData.length - 1]._id)
      setInitialTime(dayjs().format())
    } catch (error: any) {
      if (typeof error === 'string') return setErrorMessage(error)
      else {
        console.error(error)
        return setErrorMessage('Unknwon error occurred')
      }
    }
  }

  const onClickCancel = async () => {
    try {
      await cancelWebhookTrigger()
    } catch (error: any) {
      if (typeof error === 'string')
        toast({
          title: 'Cancelation Operation failed',
          description: `${error}\nWe forced a cancellation.`,
          variant: 'destructive',
        })
      else {
        console.error(error)
        toast({
          title: 'Test Trigger Webhook Error',
          description: 'Unknwon error occurred. We forced a cancellation',
          variant: 'destructive',
        })
      }
    }
  }

  const GenerateDataButton = () =>
    flowOperationRunning && webhookTriggerWatcherWorks ? (
      <Button variant="secondary" size={'sm'} onClick={onClickCancel} className="whitespace-nowrap">
        <Icons.Spinner className="h-4 w-4 mr-1" />
        Cancel Test
      </Button>
    ) : (
      <GenerateTestDataButton
        haveSampleData={!!sampleData}
        onSelectSampleData={onSelectSampleData}
        // or when test starts but the watcher isn't yet enabled
        disabled={disabled || (!!flowOperationRunning && !webhookTriggerWatcherWorks)}
        disabledMessage={disabledMessage}
        text={data?.length ? 'Regenerate Data' : 'Generate Data'}
        onClick={onClickTest}
        loading={!!flowOperationRunning}
      />
    )

  return (
    <div className="max-h-full overflow-scroll">
      {flowOperationRunning === FlowOperationRunnType.TEST_WEBHOOK ? (
        <WarningInfo className="my-2">
          <Small>
            Action Required: Please go to {editedConnectorMetadata?.displayName} and perform action to trigger &quot;{triggerDisplayName}&quot;
          </Small>
        </WarningInfo>
      ) : null}
      {data?.length ? (
        <>
          {/* TODO handle error state */}
          <div className="flex h-20 px-1 mt-2 items-center flex-wrap">
            <div className="flex-center flex-grow">
              <GenerateDataButton />
            </div>
            <div className="flex flex-row flex-wrap">
              <h5 className="flex items-center gap-2">
                <Icons.True className="text-positive" />
                Loaded data successfully
              </h5>
              <Muted className="ml-7">{relativeTime}</Muted>
            </div>
          </div>
          <Select onValueChange={onChangeTriggerEvent} value={selectedTriggerEventId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select other event" />
            </SelectTrigger>
            <SelectContent position="popper">
              {data.map((triggerEvent, index) => {
                return (
                  <SelectItem value={triggerEvent._id} key={triggerEvent._id}>
                    <span className="flex gap-2 items-center">
                      <p>
                        Event {index + 1} - {dayjs(triggerEvent.createdAt).format('YYYY/MM/DD HH:mm:ss')}
                      </p>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </>
      ) : (
        <>
          <div className="pt-3 pl-1">
            <Muted>The sample sata can be used in next steps</Muted>
          </div>
          <div className="flex h-14 px-1 flex-center">
            <GenerateDataButton />
          </div>
        </>
      )}

      {errorMessage.length ? <ErrorInfo message={errorMessage} className="m-2" /> : null}

      {record && (
        <CodeEditor
          value={record}
          //  heightVh={panelSize} substractPx={280}
          title="Output"
          className="mt-2"
        />
      )}
    </div>
  )
}
