import { CustomError, ErrorCode, Id, assertNotNullOrUndefined, isConnectorTrigger, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@linkerry/ui-components/client'
import { Icons, Muted } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useRelativeTime } from '../../../libs/dayjs'
import { getBrowserQueryCllient, useClientQuery } from '../../../libs/react-query'
import { CodeEditor } from '../../../shared/components/Code/CodeEditor'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { TriggerApi } from '../../flows/triggers/api'
import { GenerateTestDataButton } from '../steps/GenerateTestDataButton'
import { useEditor } from '../useEditor'

export interface TriggerTestFunctionProps extends HTMLAttributes<HTMLElement> {
  panelSize: number
  disabled: boolean
  disabledMessage: string
  sampleData?: any
}

export const TriggerTestFunction = ({ panelSize, disabled, disabledMessage, sampleData }: TriggerTestFunctionProps) => {
  const { toast } = useToast()
  const { flow, editedTrigger, testPoolTrigger, flowOperationRunning, patchEditedTriggerConnector } = useEditor()
  assertNotNullOrUndefined(editedTrigger?.name, 'editedTrigger.name')
  if (!isConnectorTrigger(editedTrigger))
    throw new CustomError('Invalid trigger type, can not use other than ConnectorTrigger', ErrorCode.INVALID_TYPE, {
      editedTrigger,
    })

  const [record, setRecord] = useState('')
  const [selectedTriggerEventId, setSelectedTriggerEventId] = useState<string>()
  const { relativeTime, setInitialTime } = useRelativeTime()
  const [errorMessage, setErrorMessage] = useState<string>('')

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

      setErrorMessage('')
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
      const triggerEvents = await testPoolTrigger()
      const queryClient = getBrowserQueryCllient()
      queryClient.setQueryData(['trigger-events', editedTrigger.name], triggerEvents)
      setRecord(prepareCodeMirrorValue(triggerEvents[triggerEvents.length - 1].payload))
      setSelectedTriggerEventId(triggerEvents[triggerEvents.length - 1]._id)
      setInitialTime(dayjs().format())
    } catch (error) {
      console.error(error)
      if (isCustomHttpExceptionAxios(error)) {
        setErrorMessage(error.response.data.message)
      } else
        toast({
          title: 'Loading trigger sample data failed',
          description: 'Can not retrive sample data. Make sure that your app have all necessary data and can it provide to linkerry',
          variant: 'destructive',
        })
    }
  }

  return (
    <div className="max-h-full overflow-scroll">
      {data?.length ? (
        <>
          {/* TODO handle error state */}
          <div className="flex h-20 px-1 mt-2 items-center flex-wrap">
            <div className="flex-center flex-grow">
              <GenerateTestDataButton
                haveSampleData={!!sampleData}
                onSelectSampleData={onSelectSampleData}
                disabled={disabled}
                disabledMessage={disabledMessage}
                text="Regenerate Data"
                onClick={onClickTest}
                loading={!!flowOperationRunning}
              />
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
          <div className="flex h-20 px-1 flex-center">
            <GenerateTestDataButton
              haveSampleData={!!sampleData}
              onSelectSampleData={onSelectSampleData}
              disabled={disabled}
              disabledMessage={disabledMessage}
              text="Generate Data"
              onClick={onClickTest}
              loading={!!flowOperationRunning}
            />
          </div>
        </>
      )}
      {errorMessage.length ? (
        <ErrorInfo message={errorMessage} className="m-2" />
      ) : (
        record && (
          <CodeEditor
            value={record}
            // heightVh={panelSize} substractPx={280}
            title="Output"
            className="mt-2"
          />
        )
      )}
    </div>
  )
}
