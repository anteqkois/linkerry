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
} from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { vscodeDark } from '@uiw/codemirror-theme-vscode'
import ReactCodeMirror from '@uiw/react-codemirror'
import { HTMLAttributes } from 'react'
import { useClipboard } from '../../hooks/useClicboard'

export interface CodeEditorProps extends HTMLAttributes<HTMLElement> {
	value: string
	title: string
	heightVh: number
	substractPx?: number
}

export const CodeEditor = ({ value, title, heightVh, substractPx = 0, style, className }: CodeEditorProps) => {
	const { copy } = useClipboard()

	return (
		<div className={cn('mt-2', className)}>
			<div style={{ backgroundColor: '#1e1e1e' }} className="px-2 py-1 border-b-[1.5px] border-accent flex justify-between items-center">
				<p>{title}</p>
				<div className="flex-center gap-2">
					<Dialog>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<DialogTrigger asChild>
										<Icons.FullScreen className="cursor-pointer" />
									</DialogTrigger>
								</TooltipTrigger>
								<TooltipContent side="bottom" align="end">
									<p>Expand to full screen</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
						<DialogContent className="md:max-w-none md:w-11/12 lg:w-8/12 lg:h-5/6">
							<DialogHeader>
								<DialogTitle>{title}</DialogTitle>
								{/* <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription> */}
							</DialogHeader>
							<ReactCodeMirror
								readOnly={true}
								value={value}
								style={{ overflow: 'scroll', height: '100%' }}
								theme={vscodeDark}
								extensions={[json()]}
							/>
						</DialogContent>
					</Dialog>
					<Icons.Copy className="cursor-pointer" onClick={() => copy(value)} />
				</div>
			</div>
			<ReactCodeMirror
				readOnly={true}
				value={value}
				style={{
					overflow: 'scroll',
					height: `calc(${heightVh}vh - ${substractPx}px)`,
					...style,
				}}
				theme={vscodeDark}
				extensions={[json()]}
			/>
		</div>
	)
}
