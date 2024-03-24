import { ConnectorProperty } from '@linkerry/connectors-framework'
import { FormField, FormItem, FormLabel, FormMessage, useToast } from '@linkerry/ui-components/client'
import { cn } from '@linkerry/ui-components/utils'
import { useDebouncedCallback } from '@react-hookz/web'
import { KeyboardEvent, useEffect, useState } from 'react'
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
		// TODO add data validation
		try {
			const currentData = getValues()[name]
			// setValue(name, currentData + `{{${tokenString}}}`)
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

	const [tokens, setTokens] = useState<Tokens[]>([])
	const onInputChange = useDebouncedCallback(
		(value: string) => {
			setValue(name, value)

			const textParts = value.split(TOKEN_REGEX)
			const tokens = value.match(TOKEN_REGEX) || []

			const categorizedResult: Tokens[] = []

			for (let i = 0; i < textParts.length || i < tokens.length; i++) {
				if (textParts[i]) {
					categorizedResult.push({ type: 'text', value: textParts[i] })
				}
				if (tokens[i]) {
					categorizedResult.push({ type: 'token', value: tokens[i] })
				}
			}

			setTokens(categorizedResult)
			console.log(categorizedResult)
		},
		[],
		500,
	)

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		if (event.key === 'Backspace' || event.key === 'Delete') {
			// if (/* Your condition to allow deletion */) {
			//   return;
			// }
			// Prevent default action of deletion
			event.preventDefault()
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
					{/* <FormControl> */}
					{/* <Input {...field} onFocus={() => setShowDynamicValueModal(true, onSelectData)} /> */}

					<div
						contentEditable
						onFocus={() => setShowDynamicValueModal(true, onSelectData)}
						className={cn(
							'flex h-9 w-full rounded-md border border-input bg-card px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
						)}
						// @ts-ignore
						onInput={(event) => onInputChange(event.target?.textContent)}
						onKeyDown={handleKeyDown}
					>
						{tokens.map((entry) => {
							if (entry.type === 'text') return entry.value
							else if (entry.type === 'token') return <span className="border p-0.5 mx-1 border-primary-foreground">{entry.value}</span>
						})}
					</div>
					{/* </FormControl> */}
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}
