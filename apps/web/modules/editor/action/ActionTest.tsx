import { json } from '@codemirror/lang-json'
import { assertNotNullOrUndefined, isCustomError, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Icons, Small } from '@linkerry/ui-components/server'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { HTMLAttributes, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { GenerateTestDataButton } from '../steps/GenerateTestDataButton'
import { useEditor } from '../useEditor'

export interface ActionTestProps extends HTMLAttributes<HTMLElement> {
	panelSize: number
	disabled: boolean
	disabledMessage: string
}

export const ActionTest = ({ panelSize, disabled, disabledMessage }: ActionTestProps) => {
	const { editedAction, testConnectorLoading, testAction } = useEditor()
	const [errorMessage, setErrorMessage] = useState('')
	assertNotNullOrUndefined(editedAction?.name, 'editedAction.name')

	const onClickTest = async () => {
		try {
			await testAction()
		} catch (error: unknown) {
			if (isCustomError(error)) {
				setErrorMessage(error.message)
			} else if (isCustomHttpExceptionAxios(error)) {
				setErrorMessage(error.response.data.message)
			} else {
				setErrorMessage('Unknwon error occured. Check your action options and try again')
			}
			console.error(error)
		}
	}

	// TODO test error response from engine or api !!!!

	return (
		<div>
			<div className="pt-3 pl-1">
				<Small>Generate sample sata</Small>
			</div>
			{/* TODO handle error state */}
			{editedAction.settings.inputUiInfo.currentSelectedData ? (
				<>
					<div className="flex h-14 px-1 items-center justify-between gap-4">
						<h5 className="flex items-center gap-2">
							<Icons.True className="text-positive" />
							Loaded data successfully
						</h5>
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
							value={prepareCodeMirrorValue(editedAction.settings.inputUiInfo.currentSelectedData)}
							style={{
								overflow: 'scroll',
								height: `calc(${panelSize}vh - 180px)`,
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
					{errorMessage && <ErrorInfo message={errorMessage} />}
				</>
			)}
		</div>
	)
}
