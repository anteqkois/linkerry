import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormControl, FormField, FormItem, FormLabel, FormMessage, Input, useToast } from '@linkerry/ui-components/client'
import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useEditor } from '../useEditor'
import { useDynamicField } from './useFieldCustomValidation'

interface TextFieldProps {
	property: ConnectorProperty
	name: string
}

const TOKEN_REGEX = /{{[^{}]+}}/g

type Tokens =
	| {
			type: 'text'
			value: string
	  }
	| {
			type: 'token'
			value: string
	  }

export const TextField = ({ property, name }: TextFieldProps) => {
	const { toast } = useToast()
	const { setShowDynamicValueModal } = useEditor()
	const { control, trigger, setValue, getValues } = useFormContext()
	const { rules } = useDynamicField({
		property,
	})

	useEffect(() => {
		trigger(name)
	}, [])

	const onSelectData = (tokenString: string, data: any) => {
		// TODO add data validation and better UI
		try {
			const currentData = getValues()[name]
			setValue(name, currentData + `{{${tokenString}}}`)
		} catch (error) {
			console.error(error)
			toast({
				title: 'Invalid data type',
				description: `Unfortunately you can't use this data probably from their incorrect type/schema`,
				variant: 'destructive',
			})
		}
	}

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
						{/* <TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger>
									<Icons.Power size={'sm'} className="mb-1 mr-2" />
								</TooltipTrigger>
								<TooltipContent side="bottom" align="start" asChild>
									<p>Dynamic value</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider> */}
					</div>
					<FormControl>
						<Input {...field} onFocus={() => setShowDynamicValueModal(true, onSelectData)} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
