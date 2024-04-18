import { Price, Product } from '@linkerry/shared'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

const planContainerVariants = cva(
	'',
	{
		variants: {
			variant: {
				default: '',
				featured: '',
			},
		},
		defaultVariants: {
			variant: 'default',
		},
	},
)

export interface PlanCardProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof planContainerVariants> {
	product: Product
	price: Price
}

export const PlanCard = ({ price, product }: PlanCardProps) => {
	return <></>
}
