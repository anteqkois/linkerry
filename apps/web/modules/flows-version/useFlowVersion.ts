
export const useFlowVersion = () => {
  // const patch = async (id: Id, flowVersion: Partial<Omit<FlowVersion, 'triggers' | 'actions'>>) => {
  //   const { data } = await FlowVersionApi.patch(id, flowVersion)
  //   return data
  // }

  // const patchTrigger = async (id: Id, trigger: Partial<Trigger> & { id: Id }) => {
  //   const { data } = await FlowVersionApi.patchTrigger(id, trigger)
  //   return data
  // }

  return {
    // patchTrigger,
    // patch,
  }
}
