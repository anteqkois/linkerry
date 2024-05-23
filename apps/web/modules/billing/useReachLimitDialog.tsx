'use client'

import { ErrorCodeQuota, PlanConfigurationDetailsValue, PlanProductConfiguration, planConfigurationDetails } from '@linkerry/shared'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useMemo, useState } from 'react'

type ReturnType = {
  showDialog: boolean
  setShowDialog: Dispatch<SetStateAction<boolean>>
  reachedLimitErrorCode: ErrorCodeQuota | undefined
  setReachedLimitErrorCode: Dispatch<SetStateAction<ErrorCodeQuota | undefined>>
  showDialogBasedOnErrorCode: (error: ErrorCodeQuota) => void
  exceededConfigurationEntry: PlanConfigurationDetailsValue | null
  customConfigurationItemValues: Partial<Record<keyof PlanProductConfiguration, string>>
  setCustomConfigurationItemValues: Dispatch<SetStateAction<Partial<Record<keyof PlanProductConfiguration, string>>>>
}

const Context = createContext<ReturnType>({} as ReturnType)

export const ReachLimitDialogProvider = ({ children }: PropsWithChildren) => {
  const [showDialog, setShowDialog] = useState(false)
  const [reachedLimitErrorCode, setReachedLimitErrorCode] = useState<ErrorCodeQuota>()
  const [customConfigurationItemValues, setCustomConfigurationItemValues] = useState<Partial<Record<keyof PlanProductConfiguration, string>>>({})

  const showDialogBasedOnErrorCode = (code: ErrorCodeQuota) => {
    setReachedLimitErrorCode(code)
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
