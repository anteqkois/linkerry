import { json } from '@codemirror/lang-json'
import { RunActionResponse, assertNotNullOrUndefined, isCustomError, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Icons, Muted, Small } from '@linkerry/ui-components/server'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { HTMLAttributes, useEffect, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { useRelativeTime } from '../../../libs/dayjs'
import { GenerateTestDataButton } from '../steps/GenerateTestDataButton'
import { useEditor } from '../useEditor'

export interface ActionTestProps extends HTMLAttributes<HTMLElement> {
	panelSize: number
	disabled: boolean
	disabledMessage: string
}

export const ActionTest = ({ panelSize, disabled, disabledMessage }: ActionTestProps) => {
	const { editedAction, testConnectorLoading, testAction } = useEditor()
	const [testData, setTestData] = useState<RunActionResponse | undefined>()
	assertNotNullOrUndefined(editedAction?.name, 'editedAction.name')
	const { relativeTime, setInitialTime, dayjs } = useRelativeTime()

	const onClickTest = async () => {
		try {
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
			setTestData({
				output: errorMessage,
				standardError: '',
				standardOutput: '',
				success: false,
			})

			console.error(error)
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
								{/* <Muted className="ml-7">{dayjs().to(dayjs(editedAction.settings.inputUiInfo.lastTestDate))}</Muted> */}
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
							loading={testConnectorLoading}
						/>
					</div>
					<div className="mt-2">
						<CodeMirror
							readOnly={true}
							value={prepareCodeMirrorValue(testData.output)}
							style={{
								overflow: 'scroll',
								height: `calc(${panelSize}vh - 130px)`,
							}}
							theme={vscodeDark}
							extensions={[json()]}
						/>
					</div>
				</>
			) : (
				<>
					<div className="flex h-20 px-1 center">
						<GenerateTestDataButton
							disabled={disabled}
							disabledMessage={disabledMessage}
							text="Generate Data"
							onClick={onClickTest}
							loading={testConnectorLoading}
						/>
					</div>
				</>
			)}
		</div>
	)
}
