import { ConnectorMetadata, ConnectorProperty, PropertyType, TriggerBase } from '@market-connector/connectors-framework'
import { TriggerType } from '@market-connector/shared'
import {
  Checkbox,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@market-connector/ui-components/client'
import { Button, H5, Icons } from '@market-connector/ui-components/server'
import Image from 'next/image'
import { HTMLAttributes, useEffect } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import { useClientQuery } from '../../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../../connectors-metadata/api/query-configs'
import { useEditor } from '../../useEditor'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}
const connectorMetadata = {
  _id: {
    $oid: '65872bff736a059c0a4642e2',
  },
  displayName: 'Coingecko',
  name: '@market-connector/coingecko',
  description: 'Coingecko connector for cryptocurrency data',
  logoUrl:
    'https://lh3.googleusercontent.com/fife/AGXqzDmFSJ2IUKtH36tY4ZY99CHpjVQo80BTOWxHriDPrJmGWvcaVqQP__eFKxgbkP8TJeT0eAuDooaAI0ZnpGq7vanGRF9aEMS9ehKFrdNRWx_BNG5kqlQGjNBr1DH6gk3aY46XozUsy_l8ajFWuXPhTW26KSYHceY-Y2aYGrv5q3n6ILRcsiFownw-GUzUFx4PDH1B9itHoLkdvjDMNaJh0Q6ksPfyVTymjqg4p1s8Z5EolfSoAOiepr8WEpBj32Jd-Ju4bpYkPqQ7QaP_pkTrlTGkq1uSrXuOm6ZYeD2dNzmiW_hVgh7yp0DXwqfJLsq3Ug9osj8fBevrWfzoKtkINL7Dk1NUIphGAEEGTXgn3nRSZOZPou28N3QiU_EcsbIh_R9qzxIA8NluWwQeno7gyBdbav30j-8GretuDKZkFOLWpAX62PUbK9fwbvbWk2VbN62pr4bXXHbmjBkDzFiY_rW3no-aY9ItpRanEk7f7LugrISCVa6ZXTWL4qMLkZ1GLoyVeDy1aMynV6HG_xVx2gc9pIBMtC5p6I1r1eZmwfvy10xew9DQxXwObGmj8g9hCNmqdyHTdOhJlRHSQMlPIXZ__iaPpy0nID-dNqPebSHt_VOOHo-M5cuWnkUhsQ82lWhB2FgFD5Ag-ZMN3JggwZ0RNssckwh6xbXoU-H1yHWW2t3xfr9z7Q6UgCDWRJ0IcR6noKvI8YWLOhbB4P5us6tMw1oNbFKCPN3hybavXSzFrxHNp4W7Yno6HdFFyXZVnJONJNd-RHfETTX0f_Bv7dH2fvV-tz9FnKxmiJ8XWCrNfksvbSanqiRH772vFrjC9uWKkIoG9O-yaqkelVFYHPndngVCycTuJ813HiWMljsTxU0GuoxT7mbwQFr7Y6gzjiJWIcZeMyn6oFgphDCURFAXU0CQQfwoZP0eBlHXB5yCsR1TthG_0Gx1nXWnNbWo6ofOqULyyWf_BdtTRHMxXEkbsWRqqK1ha6mifySrA0jkXNHkX1XhmzL876QXm7i9_95m2IwER9Aw-JGpV8_fxcPWz4-TsrM5a1ekgnKcr-i5kJQLtj2CgnKu0bJz3byuHn8I9AZJScl4fsus2bb_yE0lvDvze4fTPTZnq4klTYbAU8azUe8qc0mhNZ73xc5CEw9UBrPJaoK7VSvquU6vJVSQegGQZcxl2TVnEaV-1YC89XxODRo8wOTkkQPe21DghS9xMAFACVv09oJGDzEWjCL_8MJ3BMV4VlOS3O5BQiSL8Q30RhmN_tUANFbnewAPx5T7pjZ5wfvtS3DKzA2-wedmTejaRpJBxREkvZDxZ0zdpiLTAoAp5ktZmax0Tf-3N1QEkziGsnLnUIuDXphfJzaMqFD-hDPVkuDun05F70KidXVHV-AbU2hes8UqsXFeCz6oOPJw29l74LkEt30jo4F6AFDqEQIoKLDZo0mx0BGYQXzS5En3X6RrAYA1ZYdcxEYV_vhW9-x6kGtZrhQVUww5MyZExfSWajoth1vBO-b9hBWm2XA_y2AAUX5hDT-KVm_tlqhh2iwbdg198p-ijYZiasyJ2mSuJseyupRcXI7kQMrahwTT6dQRI_Cku-EOgoDbBPjLWuuYhGgZbjAvfwZj-MPfYN7PRdcKOgR_ePYctB8nd0QcKRoFRBRdLkvLQArh4Aya=w2094-h1602',
  actions: {
    fetch_marketcap: {
      name: 'fetch_marketcap',
      displayName: 'Fetch crypot marketcap',
      description: 'Fetch crypto marketcap',
      props: {
        interval: {
          displayName: 'Interval',
          name: 'minutes_interval',
          required: true,
          description: 'Every x minutes fetch data (min: 5, max: 60)',
          validators: [],
          type: 'Number',
        },
      },
      requireAuth: false,
    },
  },
  triggers: {
    fetch_top_hundred: {
      name: 'fetch_top_hundred',
      displayName: 'Fetch top 100 coins',
      description: 'Fetch top 100 coins data',
      props: {
        interval: {
          displayName: 'Interval',
          name: 'minutes_interval',
          required: true,
          description: 'Every x minutes fetch data (min: 5, max: 60)',
          validators: [],
          type: 'Number',
        },
      },
      type: 'POLLING',
      handshakeConfiguration: {
        strategy: 'NONE',
      },
      requireAuth: false,
      sampleData: {},
    },
    fetch_by_id: {
      name: 'fetch_by_id',
      displayName: 'Fetch by coingecko id',
      description: 'Fetch by coingecko id',
      props: {
        interval: {
          displayName: 'Interval',
          name: 'minutes_interval',
          required: true,
          description: 'Every x minutes fetch data (min: 5, max: 60)',
          validators: [],
          type: 'Number',
        },
      },
      type: 'POLLING',
      handshakeConfiguration: {
        strategy: 'NONE',
      },
      requireAuth: false,
      sampleData: {},
    },
  },
  auth: null,
  minimumSupportedRelease: '0.0.0',
  maximumSupportedRelease: '9999.9999.9999',
  tags: ['cryptocurrency', 'data feed'],
  version: '0.0.1',
} as unknown as ConnectorMetadata

const DynamicField = ({ form, property }: { form: UseFormReturn<any, any>; property: ConnectorProperty }) => {
  if (property.defaultValue) form.setValue(property.name, property.defaultValue)

  switch (property.type) {
    case PropertyType.Text:
      return (
        <FormField
          control={form.control}
          name={property.name}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{property.displayName}</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )
    case PropertyType.Checkbox:
      return (
        <FormField
          control={form.control}
          name={property.name}
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>{property.displayName}</FormLabel>
                <FormDescription>{property.description}</FormDescription>
              </div>
            </FormItem>
          )}
        />
        // <FormField
        //   control={form.control}
        //   name={property.name}
        //   render={({ field }) => (
        //     <FormItem>
        //       <FormLabel>{property.displayName}</FormLabel>
        //       <FormControl>
        //         <Input {...field} />
        //       </FormControl>
        //       <FormMessage />
        //     </FormItem>
        //   )}
        // />
      )

    default:
      break
  }
}

// export const SelectTrigger = ({}: SelectTriggerProps) => {
export const TriggerDrawer = () => {
  const { editedTrigger, updateEditedTrigger } = useEditor()
  if (!editedTrigger || editedTrigger?.type !== TriggerType.Connector) throw new Error('Missing editedTrigger')

  const { data: connectorMetadata, isFetching } = useClientQuery(connectorsMetadataQueryConfig.getOne({ id: editedTrigger.settings.connectorId }))

  const triggerForm = useForm<{ trigger: TriggerBase }>({})

  const triggerWatcher = triggerForm.watch('trigger')
  useEffect(() => {
    if (triggerWatcher?.displayName) updateEditedTrigger({ displayName: triggerWatcher.displayName })
  }, [triggerWatcher])

  // const handleSelectTrigger = (row: Row<ConnectorMetadata>) => {
  //   if(!editedTrigger) throw new Error('Can not retrive editTrigger data')
  //   // fetch conector ? or better in node and to show info use metadata
  //   // replace current node to trigger node
  //   updateNode(editedTrigger.id, triggerNodeFactory({trigger: editedTrigger, connectorMetadata: row.original}))
  // }

  if (!connectorMetadata) return <div>Can not find connector details</div>
  if (isFetching) return <Icons.spinner />

  const handleOnSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <div>
      <div className="flex items-center justify-center gap-2">
        <Image width={36} height={36} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
        <div>
          <H5>{connectorMetadata.displayName}</H5>
        </div>
      </div>
      <Form {...triggerForm}>
        <form onSubmit={triggerForm.handleSubmit(handleOnSubmit)} className="space-y-5">
          <FormField
            control={triggerForm.control}
            name="trigger"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger</FormLabel>
                <Select
                  onValueChange={(v) => {
                    field.onChange(v)
                    // const selectedExchange = exchanges.find((exchange) => exchange.code === v)
                    const selectedTrigger = Object.values(connectorMetadata.triggers).find((trigger) => trigger.name === v)
                    if (!selectedTrigger) return
                    triggerForm.setValue('trigger', selectedTrigger)
                  }}
                  // defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder="Select Trigger" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent position="popper">
                    {Object.values(connectorMetadata.triggers).map((trigger) => {
                      return (
                        <SelectItem value={trigger.name} key={trigger.name}>
                          <span className="flex gap-2 items-center">
                            <p>{trigger.displayName}</p>
                          </span>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {triggerWatcher
            ? Object.values(triggerWatcher.props).map((prop) => <DynamicField form={triggerForm} property={prop} key={prop.name} />)
            : null}
          {/* <FormField
            control={createForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Keys Name</FormLabel>
                <FormControl>
                  <Input placeholder="Binance bot keys..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createForm.control}
            name="aKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Access Key</FormLabel>
                <FormControl>
                  <Input placeholder="Dc290z..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={createForm.control}
            name="sKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Secret Key</FormLabel>
                <FormControl>
                  <Input placeholder="Shj20z..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="flex justify-end">
            {/* <Button type="submit" loading={isLoading} className="w-full"> */}
            <Button type="submit" className="w-full">
              Create
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
