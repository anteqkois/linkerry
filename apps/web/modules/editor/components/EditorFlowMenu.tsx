import { isCustomHttpExceptionAxios } from '@linkerry/shared'
import { Menubar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, useToast } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, useCallback, useMemo } from 'react'
import { useEditor } from '../useEditor'

export interface EditorFlowMenuProps extends HTMLAttributes<HTMLElement> {}

export const EditorFlowMenu = ({ children }: EditorFlowMenuProps) => {
	const { flow, publishFlow, publishLoading } = useEditor()
	const flowValidity = useMemo(() => {
		if (flow.version.stepsCount < 2) return { invalid: true, message: 'Add one more step. Two steps are required for flow.' }
		if (!flow.version.valid) return { invalid: true, message: 'All steps must be tested and valid.' }
		if (publishLoading) return { invalid: true, message: 'Flow operation is running...' }

		return { invalid: false }
	}, [flow.version.valid, flow.version.stepsCount, publishLoading])

	const { toast } = useToast()

	const onPublishFlow = useCallback(async () => {
		try {
			await publishFlow()
		} catch (error) {
			let message = 'Unknown error occured, can not publish yout flow. Try again and inform our IT team.'

			if (isCustomHttpExceptionAxios(error))
				message = error.response.data.message

			toast({
				title: message,
				variant: 'destructive',
			})
		}
	}, [])

	return (
		<nav className="hidden sm:block fixed top-1 left-1/2 -translate-x-1/2 z-40">
			<Menubar>
				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div>
								<Button className="h-7 rounded-sm" disabled={flowValidity.invalid} onClick={onPublishFlow}>
									Publish
								</Button>
							</div>
						</TooltipTrigger>
						{flowValidity.invalid ? (
							<TooltipContent>
								<p>{flowValidity.message}</p>
							</TooltipContent>
						) : null}
					</Tooltip>
				</TooltipProvider>
				{/* <MenubarMenu>
					<MenubarTrigger className="flex gap-2">
						<Icons.Power /> Runs
					</MenubarTrigger>
					<MenubarContent>
						<MenubarItem disabled={true}>Runs Hisory</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<MenubarTrigger className="flex gap-2">
						<Icons.Version /> Versions
					</MenubarTrigger>
					<MenubarContent>
						<MenubarItem disabled={true}>All Flow versions history</MenubarItem>
					</MenubarContent>
				</MenubarMenu>
				<MenubarMenu>
					<TooltipProvider delayDuration={200}>
						<Tooltip>
							<TooltipTrigger asChild>
								<MenubarTrigger disabled={true}>Support</MenubarTrigger>
							</TooltipTrigger>
							<TooltipContent>
								<p>Will be avaible in future</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</MenubarMenu> */}
				<Button className="h-7 rounded-sm" size={'icon'} variant={'destructive'}>
					<Icons.Delete />
				</Button>
			</Menubar>
		</nav>
	)
}
