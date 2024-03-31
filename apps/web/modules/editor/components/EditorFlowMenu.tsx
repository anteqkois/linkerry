import { FlowStatus, FlowVersionState, isCustomHttpExceptionAxios } from '@linkerry/shared'
import {
	ButtonClient,
	Input,
	Menubar,
	MenubarMenu,
	Switch,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
	useToast,
} from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { useDebouncedCallback } from '@react-hookz/web'
import { ChangeEvent, HTMLAttributes, useCallback, useMemo, useRef, useState } from 'react'
import { useEditor } from '../useEditor'

export interface EditorFlowMenuProps extends HTMLAttributes<HTMLElement> {}

export const EditorFlowMenu = ({ children }: EditorFlowMenuProps) => {
	const { flow, updateFlowVersionDisplayName, publishFlow, flowOperationRunning, setFlowStatus, onClickFlowRuns } = useEditor()
	const [flowVersionName, setFlowVersionName] = useState(flow.version.displayName)
	const inputFlowVersionNameRef = useRef<HTMLInputElement>(null)
	const { toast } = useToast()
	const flowValidity = useMemo(() => {
		if (flow.version.stepsCount < 2) return { invalid: true, message: 'Add one more step. Two steps are required for flow.' }
		if (!flow.version.valid) return { invalid: true, message: 'All steps must be tested and valid.' }
		if (flowOperationRunning) return { invalid: true, message: 'Flow saving logic is running... .' }
		if (flow.version.state === FlowVersionState.LOCKED && flow.version._id === flow.publishedVersionId)
			return { invalid: true, message: 'Flow Version is locked.' }

		return { invalid: false }
	}, [flow.version.valid, flow.version.stepsCount, flowOperationRunning])

	const onPublishFlow = useCallback(async () => {
		try {
			await publishFlow()

			toast({
				title: 'Flow Version published',
				description: 'Your Flow is live now! We are in Beta version, so please inform our Team if something get wrong.',
				variant: 'success',
			})
		} catch (error) {
			let message = 'Unknown error occured, can not publish yout flow. Try again and inform our Team.'

			if (isCustomHttpExceptionAxios(error)) message = error.response.data.message

			toast({
				title: message,
				variant: 'destructive',
			})
		}
	}, [])

	const onChangeFlowStatus = useCallback(async () => {
		try {
			switch (flow.status) {
				case FlowStatus.DISABLED:
					await setFlowStatus(FlowStatus.ENABLED)
					toast({
						title: 'Flow Enabled',
						description: 'Your Flow is live. We are in Beta version, so please inform our Team if something get wrong.',
						variant: 'success',
					})
					break
				case FlowStatus.ENABLED:
					await setFlowStatus(FlowStatus.DISABLED)
					toast({
						title: 'Flow Disabled',
						description: 'Your Flow was stoped. We are in Beta version, so please inform our Team if something get wrong.',
						variant: 'success',
					})
					break
			}
		} catch (error) {
			let message = 'Unknown error occured, can not update your flow status. Try again and inform our Team.'

			if (isCustomHttpExceptionAxios(error)) message = error.response.data.message

			toast({
				title: message,
				variant: 'destructive',
			})
		}
	}, [flow.status])

	const updateFlowVersionNameHandler = useDebouncedCallback(
		async (newName) => {
			await updateFlowVersionDisplayName(newName)
		},
		[flowVersionName],
		1000,
	)

	const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
		setFlowVersionName(e.target.value)
		await updateFlowVersionNameHandler(e.target.value)
	}

	return (
		<nav className="hidden sm:block fixed top-1 left-1/2 -translate-x-1/2 z-40">
			<Menubar>
				<MenubarMenu>
					{/* //TODO implement resiseable input */}
					<div className="text-sm font-extrabold">
						<Icons.Edit
							onClick={(e) => !flowOperationRunning && inputFlowVersionNameRef.current?.focus()}
							size={'sm'}
							className="absolute left-2 top-1/2 -translate-y-1/2 cursor-pointer"
						/>
						<Input
							ref={inputFlowVersionNameRef}
							value={flowVersionName}
							onChange={onChangeHandler}
							disabled={flowOperationRunning}
							className="border-0 h-7 ml-0 pl-6 w-36"
						/>
					</div>
				</MenubarMenu>
				<MenubarMenu>
					<Button className="h-7 rounded-sm" onClick={onClickFlowRuns} variant={'ghost'}>
						Runs
					</Button>
				</MenubarMenu>
				<MenubarMenu>
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger asChild>
								<div>
									<ButtonClient className="h-7 rounded-sm" disabled={flowValidity.invalid} onClick={onPublishFlow} loading={flowOperationRunning}>
										Publish
									</ButtonClient>
								</div>
							</TooltipTrigger>
							{flowValidity.invalid ? (
								<TooltipContent>
									<p>{flowValidity.message}</p>
								</TooltipContent>
							) : null}
						</Tooltip>
					</TooltipProvider>
				</MenubarMenu>
				{flow.publishedVersionId ? (
					<MenubarMenu>
						<div className="px-2 flex-center">
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex-center">
											<Switch
												id="flow-enabled"
												checked={flow.status === FlowStatus.ENABLED}
												onCheckedChange={onChangeFlowStatus}
												disabled={flowOperationRunning}
											/>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Published Version is run</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					</MenubarMenu>
				) : null}
				{/* <MenubarMenu>
					<Button className="h-7 rounded-sm" size={'icon'} variant={'destructive'}>
						<Icons.Delete />
					</Button>
				</MenubarMenu> */}
			</Menubar>
		</nav>
	)
}
