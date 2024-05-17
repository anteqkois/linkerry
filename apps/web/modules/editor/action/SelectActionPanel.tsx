import { ConnectorMetadataSummary } from '@linkerry/connectors-framework'
import { isCustomHttpExceptionAxios, isQuotaErrorCode } from '@linkerry/shared'
import { ScrollArea, useToast } from '@linkerry/ui-components/client'
import { useReachLimitDialog } from '../../billing/useReachLimitDialog'
import { ConnectorsList } from '../../flows/connectors/ConnectorsList'
import { useEditor } from '../useEditor'

export const SelectActionPanel = () => {
  const { showDialogBasedOnErrorCode } = useReachLimitDialog()
  const { handleSelectActionConnector } = useEditor()
  const { toast } = useToast()

  const handleSelectAction = async (connector: ConnectorMetadataSummary) => {
    try {
      await handleSelectActionConnector(connector)
    } catch (error) {
      let errorDescription = 'We can not add new step to your flow. Please inform our Team'

      if (isCustomHttpExceptionAxios(error)) {
        if (isQuotaErrorCode(error.response.data.code)) return showDialogBasedOnErrorCode(error.response.data.code)
        else errorDescription = error.response.data.message
      }

      toast({
        title: 'Can not update Flow',
        description: errorDescription,
        variant: 'destructive',
      })
    }
  }

  return (
    <ScrollArea className="overflow-scroll max-h-full">
      <ConnectorsList onClickConnector={handleSelectAction} connectorType="action" />
    </ScrollArea>
  )
}
