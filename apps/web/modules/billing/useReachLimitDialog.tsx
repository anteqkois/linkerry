'use client'

import { ErrorCodeQuota, PlanConfigurationDetailsValue, PlanProductConfiguration, planConfigurationDetails } from '@linkerry/shared'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from 'react'

export type CustomConfigurationItemValues = Partial<Record<keyof PlanProductConfiguration, string>>

type ReturnType = {
  showDialog: boolean
  setShowDialog: Dispatch<SetStateAction<boolean>>
  reachedLimitErrorCode: ErrorCodeQuota | undefined
  setReachedLimitErrorCode: Dispatch<SetStateAction<ErrorCodeQuota | undefined>>
  showDialogBasedOnErrorCode: (error: ErrorCodeQuota, _customConfigurationItemValues?: CustomConfigurationItemValues) => void
  exceededConfigurationEntry: PlanConfigurationDetailsValue | null
  customConfigurationItemValues: CustomConfigurationItemValues
  setCustomConfigurationItemValues: Dispatch<SetStateAction<CustomConfigurationItemValues>>
}

const Context = createContext<ReturnType>({} as ReturnType)

export const ReachLimitDialogProvider = ({ children }: PropsWithChildren) => {
  const [showDialog, setShowDialog] = useState(false)
  const [reachedLimitErrorCode, setReachedLimitErrorCode] = useState<ErrorCodeQuota>()
  const [customConfigurationItemValues, setCustomConfigurationItemValues] = useState<CustomConfigurationItemValues>({})

  useEffect(() => {
    if (!showDialog) setCustomConfigurationItemValues({})
  }, [showDialog])

  const showDialogBasedOnErrorCode = (code: ErrorCodeQuota, _customConfigurationItemValues?: CustomConfigurationItemValues) => {
    setReachedLimitErrorCode(code)
    if (_customConfigurationItemValues) setCustomConfigurationItemValues(_customConfigurationItemValues)
    setShowDialog(true)
  }

  const exceededConfigurationEntry = useMemo(() => {
    if (!reachedLimitErrorCode) return null
    const configDetails = Object.entries(planConfigurationDetails).find(
      ([configName, configValue]) => configValue.errorCode === reachedLimitErrorCode,
    )
    return configDetails?.[1] ?? null
  }, [reachedLimitErrorCode])

  return (
    <Context.Provider
      value={{
        showDialog,
        setShowDialog,
        reachedLimitErrorCode,
        setReachedLimitErrorCode,
        showDialogBasedOnErrorCode,
        exceededConfigurationEntry,
        customConfigurationItemValues,
        setCustomConfigurationItemValues,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export function useReachLimitDialog() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useReachLimitDialog must be used within a ReachLimitDialogProvider')
  }
  return context
}
