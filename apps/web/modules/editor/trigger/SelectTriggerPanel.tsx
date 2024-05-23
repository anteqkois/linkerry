import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { ScrollArea } from '@linkerry/ui-components/client'
import { HTMLAttributes } from 'react'
import { ConnectorsList } from '../../flows/connectors/ConnectorsList'
import { useEditor } from '../useEditor'

export type SelectTriggerProps = HTMLAttributes<HTMLElement>

export const SelectTriggerPanel = () => {
  const { handleSelectTriggerConnector } = useEditor()

  const handleSelectTrigger = async (connector: ConnectorMetadataSummary) => {
    await handleSelectTriggerConnector(connector)
  }

  return (
    <ScrollArea className="overflow-scroll max-h-full">
      <ConnectorsList onClickConnector={handleSelectTrigger} connectorType="trigger" />
    </ScrollArea>
  )
}
