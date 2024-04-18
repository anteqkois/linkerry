import { Price, Product } from '@linkerry/shared'
import { Button, ButtonProps, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@linkerry/ui-components/server'
import { cn } from '@linkerry/ui-components/utils'
import { VariantProps, cva } from 'class-variance-authority'
import { HTMLAttributes } from 'react'

const planContainerVariants = cva('', {
	variants: {
		variant: {
			default: '',
			featured: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

export interface PlanCardProps extends HTMLAttributes<HTMLElement>, VariantProps<typeof planContainerVariants> {
	product: Product
	price: Price
	buttonVariant?: ButtonProps['variant']
	popular?: boolean
	onSelectPlan: (data: { productPlan: Product; price: Price }) => void
	priceSlot?: JSX.Element
}

export const PlanCard = ({ price, product, className, buttonVariant, popular, onSelectPlan, priceSlot }: PlanCardProps) => {
	return (
		<Card className={cn('', className)}>
			<CardHeader className='h-40 lg:h-44'>
				<CardTitle className="text-4xl font-bold">{product.name}</CardTitle>
				<CardDescription>{product.shortDescription}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="mb-4 relative w-full h-10">
					{priceSlot ? (
						priceSlot
					) : (
						<div className="flex-center">
							<div className='relative'>
								<span className="absolute -top-1 -left-14 text-xl">{currencyCodeToSign[price.currencyCode]}</span>
								<span className="text-4xl -ml-10 font-medium">{price.price}</span>
								<span className="text-lg absolute bottom-0.5 pl-1 whitespace-nowrap">/ {price.period}</span>
							</div>
						</div>
					)}
				</div>

				<Button
					className="w-full"
					variant={buttonVariant}
					onClick={() =>
						onSelectPlan({
							productPlan: product,
							price,
						})
					}
				>
					Choose
				</Button>
			</CardContent>
			<CardFooter className="flex justify-between"></CardFooter>
		</Card>
	)
}

const currencyCodeToSign: Record<string, string> = {
	USD: '$',
}
