import { ConnectorProperty } from '@linkerry/connectors-framework'
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useDynamicField } from './useFieldCustomValidation'

interface TextFieldProps {
	property: ConnectorProperty
	name: string
}

export const TextField = ({ property, name }: TextFieldProps) => {
	const { control, trigger } = useFormContext()
	const { rules } = useDynamicField({
		property,
	})

	useEffect(() => {
		trigger(name)
	}, [])

	return (
		<FormField
			control={control}
			name={name}
			defaultValue={''}
			rules={rules}
			render={({ field }) => (
				<FormItem>
					<div className="flex justify-between">
						<FormLabel>{property.displayName}</FormLabel>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<Icons.Power size={'sm'} className="mb-1 mr-2" />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start" asChild>
									<p>Dynamic value</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
