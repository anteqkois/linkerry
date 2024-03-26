import { ConnectorProperty, isDynamicDropdownProperty } from '@linkerry/connectors-framework'
import { waitMs } from '@linkerry/shared'
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
	useToast,
} from '@linkerry/ui-components/client'
import { Icons } from '@linkerry/ui-components/server'
import { Dispatch, SetStateAction, useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useEditor } from '../useEditor'
import { useDynamicField } from './useFieldCustomValidation'

interface TextFieldProps {
	property: ConnectorProperty
	name: string
	showDynamicValueButton?: boolean
	setUseDynamicValue?: Dispatch<SetStateAction<boolean>>
}

export const TextField = ({ property, name, showDynamicValueButton = false, setUseDynamicValue }: TextFieldProps) => {
	const { toast } = useToast()
	const { setShowDynamicValueModal } = useEditor()
	const { control, trigger, setValue, getValues, clearErrors } = useFormContext()
	const { rules } = useDynamicField({
		property,
	})

	useEffect(() => {
		setTimeout(() => {
			if (isDynamicDropdownProperty(property)) {
				/* set all refreshers as not required */
				// TODO handle disablind validations
				property.refreshers.forEach((refresher) => {
					clearErrors(refresher)
					// unregister(refresher)
				})
			}
			console.log(property)
			trigger(name)
		}, 500)
	}, [])

	const onSelectData = async (tokenString: string, data: any) => {
		// TODO add data validation and better UI
		try {
			const currentData = getValues()[name]
			setValue(name, currentData + `{{${tokenString}}}`)
			await waitMs(500)
			trigger()
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
						{showDynamicValueButton ? (
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger onClick={() => setUseDynamicValue?.(false)} className='text-primary-foreground/80 hover:text-primary-foreground'>
										<Icons.Power size={'sm'} className="mb-1 mr-2" />
									</TooltipTrigger>
									<TooltipContent side="bottom" align="start">
										<p>Switch to not use dynamic value</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						) : null}
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
