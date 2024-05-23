import { CreateSlice, StepsSlice } from './types'

export const createStepsSlice: CreateSlice<StepsSlice> = (set, get) => ({
  setEditStepMetadata: (data: StepsSlice['editStepMetadata']) => {
    set({
      editStepMetadata: data,
    })
  },
  editStepMetadata: null,
})
