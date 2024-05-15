'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@linkerry/ui-components/client'
import { Button, Icons, Toggle } from '@linkerry/ui-components/server'
import Link from 'next/link'
import { useLiveChat } from '../../../libs/Tawk'
import { useUser } from '../../../modules/user/useUser'
import { LogoutDropDownMenuItem } from './LogoutDropDownMenuItem'

interface MyAccountMenuProps {
	children?: React.ReactNode
}

export function MyAccountMenu({ children }: MyAccountMenuProps) {
	const { user } = useUser()
	const { open, toggleVisibility, liveChatRef, hidden } = useLiveChat()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="icon" className="h-9 w-9">
					<Icons.Home className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end">
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">My Account</p>
						<p className="text-xs leading-none text-muted-foreground">{user.name}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<Link href="/app/dashboard" prefetch={false}>
						<DropdownMenuItem>Dashboard</DropdownMenuItem>
					</Link>
					<Link href="/app/subscriptions" prefetch={false}>
						<DropdownMenuItem>Subscriptions</DropdownMenuItem>
					</Link>
					{/* <DropdownMenuItem>
						Settings
						<DropdownMenuShortcut>
							<Icons.Settings />
						</DropdownMenuShortcut>
					</DropdownMenuItem> */}
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger disabled className='text-muted-foreground'>Invite users</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent className="w-56">
								<DropdownMenuItem>
									Rewards
									<DropdownMenuShortcut>
										<Icons.Rewards />
									</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuItem>
									Copy Reflink
									<DropdownMenuShortcut>
										<Icons.Copy />
									</DropdownMenuShortcut>
								</DropdownMenuItem>
								<DropdownMenuSeparator />
								<DropdownMenuItem>Statistics</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem onClick={open}>Support</DropdownMenuItem>
				<DropdownMenuSeparator />
				<LogoutDropDownMenuItem />
				<DropdownMenuSeparator />
				<TooltipProvider delayDuration={200}>
					<Tooltip>
						<TooltipTrigger asChild>
							<Toggle pressed={!hidden} onPressedChange={toggleVisibility} size={'sm'} className="my-1" aria-label="Toggle live chat">
								<Icons.Chat className="h-4 w-4" />
							</Toggle>
						</TooltipTrigger>
						<TooltipContent>
							<p>Toggle Live Chat</p>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
