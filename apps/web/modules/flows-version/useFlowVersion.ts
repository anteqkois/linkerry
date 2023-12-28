import { Trigger } from '@market-connector/shared'
import { FlowVersionApi } from './api'

export const useFlowVersion = () => {
  const updateTrigger = async (trigger: Partial<Trigger>) => {
    //
    await FlowVersionApi.updateTrigger(trigger)
  }

  return {
    updateTrigger,
  }
}
