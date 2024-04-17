import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HtmlHTMLAttributes } from 'react'

const buttonVariants = cva('px-2 mt-16 w-screen lg:max-w-none', {
	variants: {
		variant: {
			fromTop: '',
			centered: 'flex justify-center',
		},
		maxScreen: {
			true: 'max-h-screen-no-nav overflow-y-hidden',
			false: '',
		},
		padding: {
			large: 'px-10 py-2',
			default: 'px-2',
			none: 'px-0',
		},
	},
	defaultVariants: {
		variant: 'fromTop',
		padding: 'default',
		maxScreen: true,
	},
})

export interface PageProps extends HtmlHTMLAttributes<HTMLElement>, VariantProps<typeof buttonVariants> {}

export const PageContainer = ({ children, padding, maxScreen, className }: PageProps) => {
	return <main className={cn(buttonVariants({ padding, maxScreen }), className)}>{children}</main>
}
