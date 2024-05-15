import { TriggerBase, getRefreshersToRefreshedProperties } from '@linkerry/connectors-framework'
import { ConnectorGroup, TriggerTestStrategy, TriggerType, assertNotNullOrUndefined, isEmpty } from '@linkerry/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@linkerry/ui-components/client'
import { useDebouncedCallback } from '@react-hookz/web'
import { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useClientQuery } from '../../../libs/react-query'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { Spinner } from '../../../shared/components/Spinner'
import { connectorsMetadataQueryConfig } from '../../flows/connectors/api/query-configs'
import { ConnectorDrawerHeader } from '../components/ConnectorDrawerHeader'
import { DynamicValueModal } from '../components/DynamicValueModal'
import { FieldResolver } from '../form/FieldResolver'
import { ConnectionsSelect } from '../form/Inputs/ConnectionsSelect'
import { ConnectorVersion } from '../steps/ConnectorVersion'
import { retriveStepInputFromObject } from '../steps/retriveStepInputFromObject'
import { useEditor } from '../useEditor'
import { TriggerTestFunction } from './TriggerTestFunction'
import { TriggerWebhookSimulation } from './TriggerWebhookSimulation'

export const TriggerConnectorPanel = () => {
  const {
    editedTrigger,
    patchEditedTriggerConnector,
    updateEditedTrigger,
    setEditedConnectorMetadata,
    flowOperationRunning,
    setRightDrawerCustomHeader,
  } = useEditor()
  if (!editedTrigger || editedTrigger?.type !== TriggerType.CONNECTOR) throw new Error('Missing editedTrigger')
  const [testDataPanelHeight, setTestDataPanelHeight] = useState(30)

  const {
    data: connectorMetadata,
    isFetched,
    isLoading,
    error,
  } = useClientQuery(
    connectorsMetadataQueryConfig.getOne({
      connectorName: editedTrigger.settings.connectorName,
      connectorVersion: editedTrigger.settings.connectorVersion,
    }),
  )

  const triggerForm = useForm<{ __temp__trigger: TriggerBase; triggerName: TriggerBase['name'] } & Record<string, any>>({
    mode: 'all',
  })
  const triggerWatcher = triggerForm.watch('__temp__trigger')

  const refreshersToRefreshedProperties = useMemo(() => {
    if (!triggerWatcher?.props) return {}
    return getRefreshersToRefreshedProperties(triggerWatcher?.props)
  }, [triggerWatcher?.props])

  useEffect(() => {
    if (!isFetched) return
    assertNotNullOrUndefined(connectorMetadata, 'connectorMetadata', editedTrigger.settings)
    setEditedConnectorMetadata(connectorMetadata)
    setRightDrawerCustomHeader(<ConnectorDrawerHeader connectorMetadata={connectorMetadata} />)

    if (editedTrigger.type !== TriggerType.CONNECTOR || editedTrigger.settings.triggerName === '') return
    const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === editedTrigger.settings.triggerName)
    assertNotNullOrUndefined(selectedTrigger, 'selectedTrigger')

    const initData: Record<string, any> = {}
    if (selectedTrigger.props)
      Object.entries(selectedTrigger.props).map(([key, value]) => {
        if (editedTrigger.settings.input[key] !== undefined) initData[key] = editedTrigger.settings.input[key]
        else if (typeof value.defaultValue !== 'undefined') initData[key] = value.defaultValue
      })

    if (selectedTrigger.requireAuth) {
      if (editedTrigger.settings.input.auth !== undefined) initData['auth'] = editedTrigger.settings.input['auth']
    }

    /* add to the end of callstack */
    setTimeout(() => {
      triggerForm.reset({
        __temp__trigger: selectedTrigger,
        triggerName: selectedTrigger.name,
        ...initData,
      })
    }, 0)
  }, [isFetched, editedTrigger.settings.triggerName])

  // synchronize with global state and database, merge only new values
  const handleWatcher = useDebouncedCallback(
    async (values, { name }) => {
      if (!name) return

      const newData = retriveStepInputFromObject(editedTrigger.settings.input, values, {
        onlyChanged: true,
      })

      if (Object.keys(newData).length)
        await patchEditedTriggerConnector({
          settings: {
            input: newData,
          },
        })
    },
    [Object.values(editedTrigger.settings.input)],
    1000,
  )

  useEffect(() => {
    const subscription = triggerForm.watch(handleWatcher)
    return () => subscription.unsubscribe()
  }, [editedTrigger.settings.triggerName, handleWatcher])

  if (isLoading) return <Spinner />
  if (error) return <ErrorInfo errorObject={error} />
  if (!connectorMetadata) return <ErrorInfo message="Can not find connector details" />

  // build dynamic form based on selected trigger schema -> props from trigger metadata
  const onChangeTrigger = async (triggerName: string) => {
    const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === triggerName)
    assertNotNullOrUndefined(selectedTrigger, 'selectedTrigger')

    const input: Record<string, any> = {}
    if (selectedTrigger.props)
      Object.entries(selectedTrigger.props).forEach(([key, value]) => {
        if (typeof value.defaultValue === 'undefined') return
        input[key] = value.defaultValue
      })

    await updateEditedTrigger({
      name: editedTrigger.name,
      valid: false,
      displayName: selectedTrigger.displayName,
      type: TriggerType.CONNECTOR,
      settings: {
        packageType: connectorMetadata.packageType,
        connectorName: connectorMetadata.name,
        connectorVersion: connectorMetadata.version,
        connectorType: connectorMetadata.connectorType,
        triggerName: selectedTrigger.name,
        input,
        inputUiInfo: {},
      },
      nextActionName: '',
    })

    // must be after updateEditedTrigger becouse form fields uses data form editor store and generate form based on it
    triggerForm.reset({
      __temp__trigger: selectedTrigger,
      triggerName,
      ...input,
    })

    triggerForm.trigger()
  }

  return (
    <ResizablePanelGroup direction="vertical" className="max-h-screen">
      <ResizablePanel defaultSize={60} className="px-2 overflow-scroll">
        {/* <Button className="w-full mt-5" variant={'secondary'} onClick={() => resetTrigger(editedTrigger.id)}>
				Change trigger
			</Button> */}
        <Form {...triggerForm}>
          <form className="space-y-8 mt-1" onSubmit={(e) => e.preventDefault()}>
            <FormField
              control={triggerForm.control}
              name="triggerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={(v) => {
                        field.onChange(v)
                        onChangeTrigger(v)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select flow trigger">
                          <p>{triggerWatcher?.displayName}</p>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {Object.values(connectorMetadata.triggers).map((trigger) => {
                          return (
                            <SelectItem value={trigger.name} key={trigger.name} className="max-w-[400px]">
                              <p>{trigger.displayName}</p>
                              <p className="text-xs text-muted-foreground">{trigger.description}</p>
                            </SelectItem>
                          )
                        })}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {triggerWatcher?.requireAuth && connectorMetadata.auth ? (
              <ConnectionsSelect
                auth={connectorMetadata.auth}
                connector={{ name: connectorMetadata.name, displayName: connectorMetadata.displayName }}
              />
            ) : null}
            {triggerWatcher?.props &&
              Object.entries(triggerWatcher.props).map(([name, property]) => (
                <FieldResolver property={property} refreshedProperties={refreshersToRefreshedProperties[name]} name={name} key={name} />
              ))}
          </form>
        </Form>
        <ConnectorVersion connectorMetadata={connectorMetadata} className="mt-4" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      {connectorMetadata.group !== ConnectorGroup.CORE && triggerWatcher?.testStrategy === TriggerTestStrategy.TEST_FUNCTION && (
        <ResizablePanel
          defaultSize={editedTrigger.settings.inputUiInfo.currentSelectedData ? 60 : 30}
          maxSize={80}
          onResize={(size) => setTestDataPanelHeight(size)}
        >
          <TriggerTestFunction
            panelSize={testDataPanelHeight}
            // TODO refactor this
            disabled={isEmpty(triggerWatcher?.name) || Object.keys(triggerForm.formState.errors).length !== 0 || !!flowOperationRunning}
            disabledMessage={flowOperationRunning ? 'Flow operation is running' : 'First fill all required Trigger fields'}
          />
        </ResizablePanel>
      )}
      {connectorMetadata.group !== ConnectorGroup.CORE && triggerWatcher?.testStrategy === TriggerTestStrategy.SIMULATION && (
        <ResizablePanel
          defaultSize={editedTrigger.settings.inputUiInfo.currentSelectedData ? 60 : 30}
          maxSize={80}
          onResize={(size) => setTestDataPanelHeight(size)}
          className='px-1'
        >
          <TriggerWebhookSimulation
            panelSize={testDataPanelHeight}
            disabled={isEmpty(triggerWatcher?.name) || Object.keys(triggerForm.formState.errors).length !== 0 || !!flowOperationRunning}
            disabledMessage={flowOperationRunning ? 'Flow operation is running' : 'First fill all required Trigger fields'}
            triggerDisplayName={triggerWatcher.displayName}
          />
        </ResizablePanel>
      )}
      <DynamicValueModal />
    </ResizablePanelGroup>
  )
}
