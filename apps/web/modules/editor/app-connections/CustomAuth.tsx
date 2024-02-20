import { HTMLAttributes } from 'react'
import { DynamicField } from '../form/DynamicField'

export interface CustomAuthProps extends HTMLAttributes<HTMLElement> {
	props: CustomAuthProps
}

export const CustomAuth = ({ props }: CustomAuthProps) => {
	return Object.entries(props).map(([name, property]) => <DynamicField property={property} name={name} key={name} />)
}
