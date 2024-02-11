import { json } from '@codemirror/lang-json'
import { assertNotNullOrUndefined, isCustomError, isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Button, Icons, Small } from '@linkerry/ui-components/server'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import CodeMirror from '@uiw/react-codemirror'
import { HTMLAttributes, useState } from 'react'
import { prepareCodeMirrorValue } from '../../../libs/code-mirror'
import { ErrorInfo } from '../../../shared/components/ErrorInfo'
import { useEditor } from '../useEditor'

export interface ActionTestProps extends HTMLAttributes<HTMLElement> {
	panelSize: number
}

export const ActionTest = ({ panelSize }: ActionTestProps) => {
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
						<Button variant="secondary" onClick={onClickTest} size={'sm'}>
							{testConnectorLoading ? <Icons.Spinner className="mr-2" /> : <Icons.Test size={'xs'} className="mr-3" />}
							<span className="whitespace-nowrap">Regenerate Data</span>
						</Button>
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
						<Button variant="secondary" onClick={onClickTest}>
							{testConnectorLoading ? <Icons.Spinner className="mr-2" /> : <Icons.Test className="mr-3" />}
							<span className="whitespace-nowrap">Generate Data</span>
						</Button>
					</div>
					{errorMessage && <ErrorInfo message={errorMessage} />}
				</>
			)}
		</div>
	)
}
