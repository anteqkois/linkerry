import { CustomAuthProps } from '@linkerry/connectors-framework'
import { HTMLAttributes } from 'react'
import { DynamicField } from '../form/DynamicField'

export interface CustomAuthElementProps extends HTMLAttributes<HTMLElement> {
	props: CustomAuthProps
}

export const CustomAuth = ({ props }: CustomAuthElementProps) => {
	return Object.entries(props).map(([name, property]) => <DynamicField property={property} name={name} key={name} refreshedProperties={[]} />)
}
