import { zodResolver } from '@hookform/resolvers/zod'
import { TriggerType } from '@market-connector/shared'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@market-connector/ui-components/client'
import { Button, Icons } from '@market-connector/ui-components/server'
import Image from 'next/image'
import { HTMLAttributes } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useClientQuery } from '../../../../libs/react-query'
import { connectorsMetadataQueryConfig } from '../../../connectors-metadata/api/query-configs'
import { useEditor } from '../../useEditor'

export interface SelectTriggerProps extends HTMLAttributes<HTMLElement> {}

// export const SelectTrigger = ({}: SelectTriggerProps) => {
export const TriggerDrawer = () => {
  const { editedTrigger } = useEditor()
  if (!editedTrigger || editedTrigger?.type !== TriggerType.Connector) throw new Error('Missing editedTrigger')

  const { data: connectorMetadata, isFetching } = useClientQuery(connectorsMetadataQueryConfig.getOne({ id: editedTrigger.settings.connectorId }))

  const triggerForm = useForm<{ trigger: string }>({
    resolver: zodResolver(
      z.object({
        trigger: z.string(),
      }),
    ),
    defaultValues: {
      trigger: '',
    },
  })

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
      {/* {JSON.stringify(Object.values(connectorMetadata?.triggers))} */}
      <div className="flex gap-2">
        <Image width={24} height={24} src={connectorMetadata.logoUrl} alt={connectorMetadata.displayName} />
        <div>
          <p>{connectorMetadata.displayName}</p>
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
                    // createForm.setValue('exchange', selectedExchange?._id!)
                  }}
                  defaultValue={field.value}
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
      {/* {JSON.stringify(connectorMetadata.triggers)} */}
    </div>
  )
}
