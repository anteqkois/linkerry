import { Menubar, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@linkerry/ui-components/client'
import { Button, Icons } from '@linkerry/ui-components/server'
import { HTMLAttributes, useMemo } from 'react'
import { useEditor } from '../useEditor'

export interface EditorFlowMenuProps extends HTMLAttributes<HTMLElement> {}

export const EditorFlowMenu = ({ children }: EditorFlowMenuProps) => {
	const { flow } = useEditor()
	const flowValidity = useMemo(() => {
		if (flow.version.stepsCount < 2) return { invalid: true, message: 'Add one more step. Two steps are required for flow.' }
		const isAnyStepInvalid = flow.version.triggers.some((trigger) => trigger.valid == false) || flow.version.actions.some((action) => action.valid === false)
		if (isAnyStepInvalid) return { invalid: true, message: 'All steps must be tested nad valid.' }
		return { invalid: false }
	}, [...flow.version.actions.map((action) => action.valid), flow.version.stepsCount])

	return (
		<nav className="hidden sm:block fixed top-1 left-1/2 -translate-x-1/2 z-40">
			<Menubar>
				<TooltipProvider delayDuration={200}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button className="h-7 rounded-sm" disabled={flowValidity.invalid}>
								Publish
							</Button>
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
