import { Button, H5, Icons } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { cva } from 'class-variance-authority'
import { Dispatch, HTMLAttributes, SetStateAction } from 'react'

export interface DrawerProps extends HTMLAttributes<HTMLElement> {
	show: boolean
	setShow: Dispatch<SetStateAction<boolean>>
	title?: string
	position: 'left' | 'right'
}

const variants = cva('w-full h-full fixed top-0 z-40 bg-popover md:w-108 border-l border-r p-2 ease-out duration-300', {
	variants: {
		state: {
			true: 'translate-x-0',
			false: '',
		},
		position: {
			left: 'left-0',
			right: 'right-0',
		},
	},
	defaultVariants: {
		state: false,
	},
	compoundVariants: [
		{
			position: 'right',
			state: false,
			className: 'translate-x-full',
		},
		{
			position: 'left',
			state: false,
			className: '-translate-x-full',
		},
	],
})

export const Drawer = ({ show, setShow, children, title, position }: DrawerProps) => {
	return (
		<aside className={cn(variants({ state: show, position }))}>
			<header className="flex justify-between items-center pb-1">
				<H5>{title}</H5>
				<Button size={'icon'} variant={'ghost'} onClick={() => setShow((prev) => !prev)}>
					<Icons.Close size={'xs'} />
				</Button>
			</header>
			{children}
		</aside>
	)
}
