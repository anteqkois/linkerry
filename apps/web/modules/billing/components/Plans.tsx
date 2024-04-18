import { Price, Product } from '@linkerry/shared'
import { HTMLAttributes } from 'react'
import { ErrorInfo, Spinner } from '../../../shared/components'
import { useProducts } from '../products/useProducts'

export interface PlansProps extends HTMLAttributes<HTMLElement> {
	onSelectPlan: (data: { productPlan: Product; price: Price }) => void
}

export const Plans = ({ onSelectPlan }: PlansProps) => {
	const { plans, plansError, plansStatus } = useProducts()

	if (plansStatus === 'pending') return <Spinner />
	if (plansStatus === 'error') return <ErrorInfo errorObject={plansError} />

	return <>{JSON.stringify(plans)}</>
}
