import { json } from '@codemirror/lang-json'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	useToast,
} from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import js_beautify from 'js-beautify'
import { HTMLAttributes, useCallback, useEffect, useState } from 'react'
import { useClipboard } from '../../hooks/useClicboard'

export interface CodeEditorProps extends Omit<HTMLAttributes<HTMLElement>, 'onChange'> {
	value: string
	title: string
	heightVh?: number
	substractPx?: number
	readOnly?: boolean
	heightPx?: number
	onChange?: (newValue: string) => void
}

const formatOptions = { indent_size: 2, space_in_empty_paren: true }

export const CodeEditor = ({ value, title, heightVh, substractPx = 0, style, className, readOnly = true, heightPx, onChange }: CodeEditorProps) => {
	if (!heightVh && !heightPx) throw new Error(`One of heightVh|heightPx must be provided`)

	const [code, setCode] = useState(value)
	const [errorMessage, setErrorMessage] = useState('')
	const { copy } = useClipboard()
	const { toast } = useToast()

	useEffect(()=>{
		setCode(value)
	}, [value])

	const onClickBeautify = useCallback((codeString: string) => {
		const dataJson = parseCodeString(codeString)
		if (!dataJson) return
		setCode(js_beautify(dataJson, formatOptions))
	}, [])

	const parseCodeString = (codeString: string) => {
		try {
			const dataJson = JSON.stringify(JSON.parse(codeString), null, 2)
			setErrorMessage('')
			return dataJson
		} catch (error: any) {
			if (error.message.includes('JSON')) setErrorMessage(error.message)
			else
				toast({
					title: 'Format Error',
					description: error.message,
					variant: 'destructive',
				})
		}
	}

	const onChangeCode = (newCodeString: string) => {
		setCode(newCodeString)
		onChange?.(newCodeString)
		parseCodeString(newCodeString)
	}

	const onBlur = () => {
		onClickBeautify(code)
	}

	const CodeActions = () => {
		return (
			<>
				{errorMessage ? (
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger>
								<Icons.Warn className="cursor-pointer text-negative" />
							</TooltipTrigger>
							<TooltipContent side="bottom" align="end">
								<p>{errorMessage}</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				) : null}

				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger>
							<Icons.Magic className="cursor-pointer" onClick={() => onClickBeautify(code)} />
						</TooltipTrigger>
						<TooltipContent side="bottom" align="end">
							<p>Format code</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<Icons.Copy className="cursor-pointer" onClick={() => copy(code)} />
			</>
		)
	}

	return (
		<div className={cn('mt-2', className)}>
			<div
				style={{ backgroundColor: '#1e1e1e' }}
				className="px-2 py-1 border-t border-l border-r border-accent rounded-t flex justify-between items-center"
			>
				<p>{title}</p>
				<div className="flex-center gap-3">
					<CodeActions />
					<Dialog>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger asChild>
									<DialogTrigger>
										<Icons.FullScreen className="cursor-pointer" />
									</DialogTrigger>
								</TooltipTrigger>
								<TooltipContent side="bottom" align="end">
									<p>Expand to full screen</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<DialogContent className="flex flex-col h-[95vh] min-w-[95vw] pt-2.5">
							<DialogHeader className="max-h-min flex flex-row justify-between items-center pr-7">
								<DialogTitle>{title}</DialogTitle>
								<div className="flex-center gap-3">
									<CodeActions />
								</div>
							</DialogHeader>
							<ReactCodeMirror
								readOnly={readOnly}
								onChange={onChange}
								onBlur={onBlur}
								value={code}
								height="100%"
								style={{ overflow: 'scroll', height: '100%' }}
								theme={vscodeDark}
								extensions={[json()]}
							/>
						</DialogContent>
					</Dialog>
				</div>
			</div>
			<ReactCodeMirror
				className="rounded-b border border-accent"
				height={heightPx ? `${heightPx}px` : undefined}
				readOnly={readOnly}
				value={code}
				onChange={onChangeCode}
				onBlur={onBlur}
				style={{
					overflow: 'scroll',
					height: heightPx ? `${heightPx}px` : `calc(${heightVh}vh - ${substractPx}px)`,
					...style,
				}}
				theme={vscodeDark}
				extensions={[json()]}
			/>
		</div>
	)
}
