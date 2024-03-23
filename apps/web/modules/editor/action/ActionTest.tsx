import { RunActionResponse, assertNotNullOrUndefined, isCustomError, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Icons, Muted, Small } from '@linkerry/ui-components/server'
import { HTMLAttributes, useEffect, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useRelativeTime } from '../../../libs/dayjs'
import { CodeEditor } from '../../../shared/components/Code/CodeEditor'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { GenerateTestDataButton } from '../steps/GenerateTestDataButton'
import { useEditor } from '../useEditor'

export interface ActionTestProps extends HTMLAttributes<HTMLElement> {
	panelSize: number
	disabled: boolean
	disabledMessage: string
}

export const ActionTest = ({ panelSize, disabled, disabledMessage }: ActionTestProps) => {
	const { editedAction, flowOperationRunning, testAction } = useEditor()
	const [testData, setTestData] = useState<Omit<RunActionResponse, 'flowVersion'> | undefined>()
	assertNotNullOrUndefined(editedAction?.name, 'editedAction.name')
	const { relativeTime, setInitialTime, dayjs } = useRelativeTime()
	const [errorMessage, setErrorMessage] = useState<string>('')

	const onClickTest = async () => {
		try {
			setErrorMessage('')
			const result = await testAction()
			setTestData(result)
			setInitialTime(dayjs().format())
		} catch (error: unknown) {
			let errorMessage: string
			if (isCustomError(error)) {
				errorMessage = error.message
			} else if (isCustomHttpExceptionAxios(error)) {
				errorMessage = error.response.data.message
			} else {
				errorMessage = 'Unknwon error occured. Check your action options and try again'
			}

			setErrorMessage(errorMessage)

			setTestData({
				output: errorMessage,
				standardError: '',
				standardOutput: '',
				success: false,
			})
		}
	}

	useEffect(() => {
		if (!editedAction.settings.inputUiInfo.currentSelectedData || !editedAction.settings.inputUiInfo.lastTestDate) return
		setTestData({
			output: editedAction.settings.inputUiInfo.currentSelectedData,
			standardError: '',
			standardOutput: '',
			success: true,
		})
		setInitialTime(editedAction.settings.inputUiInfo.lastTestDate)
	}, [])

	return (
		<div>
			<div className="pt-3 pl-1">
				<Small>Generate sample sata</Small>
			</div>
			{testData?.output ? (
				<>
					<div className="flex h-14 px-1 items-center justify-between gap-4">
						{testData?.success ? (
							<div className="flex flex-row flex-wrap">
								<h5 className="flex items-center gap-2">
									<Icons.True className="text-positive" />
									Loaded data successfully
								</h5>
								<Muted className="ml-7">{relativeTime}</Muted>
							</div>
						) : (
							<h5 className="flex items-center gap-2">
								<Icons.False className="text-negative" />
								Testing Failed
							</h5>
						)}
						<GenerateTestDataButton
							disabled={disabled}
							disabledMessage={disabledMessage}
							text="Regenerate Data"
							onClick={onClickTest}
							loading={flowOperationRunning}
						/>
					</div>
					{errorMessage.length ? (
						<ErrorInfo message={errorMessage} className="mt-2" />
					) : (
						<CodeEditor value={prepareCodeMirrorValue(testData.output)} heightVh={panelSize} substractPx={120} title="Output" className="mt-2" />
					)}
				</>
			) : (
				<>
					<div className="flex h-20 px-1 flex-center">
						<GenerateTestDataButton
							disabled={disabled}
							disabledMessage={disabledMessage}
							text="Generate Data"
							onClick={onClickTest}
							loading={flowOperationRunning}
						/>
					</div>
				</>
			)}
		</div>
	)
}
