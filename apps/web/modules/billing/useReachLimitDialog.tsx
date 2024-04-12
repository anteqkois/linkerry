'use client'

import { CustomError, CustomHttpExceptionResponse, ErrorCodeQuota, isQuotaErrorCode } from '@linkerry/shared'
import { Dispatch, PropsWithChildren, SetStateAction, createContext, useContext, useMemo, useState } from 'react'
import { PlanConfigurationDetailsValue, planConfigurationDetails } from './planConfigurationDetails'

type ReturnType = {
	showDialog: boolean
	setShowDialog: Dispatch<SetStateAction<boolean>>
	reachedLimitErrorCode: ErrorCodeQuota | undefined
	setReachedLimitErrorCode: Dispatch<SetStateAction<ErrorCodeQuota | undefined>>
	isQuotaErrorThenShowDialog: (error: CustomError | CustomHttpExceptionResponse) => boolean
	exceededConfigurationEntry: PlanConfigurationDetailsValue | null
}

const Context = createContext<ReturnType>({} as ReturnType)

export const ReachLimitDialogProvider = ({ children }: PropsWithChildren) => {
	const [showDialog, setShowDialog] = useState(false)
	const [reachedLimitErrorCode, setReachedLimitErrorCode] = useState<ErrorCodeQuota>()

	const isQuotaErrorThenShowDialog = (error: CustomError | CustomHttpExceptionResponse) => {
		if (isQuotaErrorCode(error.code)) {
			setReachedLimitErrorCode(error.code)
			setShowDialog(true)
			return true
		}

		return false
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
				isQuotaErrorThenShowDialog,
				exceededConfigurationEntry,
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
