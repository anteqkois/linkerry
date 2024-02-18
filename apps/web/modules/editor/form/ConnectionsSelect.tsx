import { ConnectorAuthProperty } from '@linkerry/connectors-framework'
import {
	Dialog,
	DialogContent,
	DialogTrigger,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectTrigger,
	SelectValue,
} from '@linkerry/ui-components/client'
import { HTMLAttributes } from 'react'
import { useFormContext } from 'react-hook-form'
import { CreateAppConnection } from '../app-connections/CreateAppConnection'

export interface ConnectionsSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	// property: StaticDropdownProperty
	// initData?: DropdownOption<any>
	name: string
	auth: ConnectorAuthProperty
}

// export const ConnectionsSelect = ({ property, initData, name }: ConnectionsSelectProps) => {
export const ConnectionsSelect = ({ auth, name }: ConnectionsSelectProps) => {
	const { setValue, control, getValues, trigger } = useFormContext()

	// const { rules } = useDynamicField({
	// 	property,
	// })

	// // setup temp field which holds String value based on started value from database
	// useEffect(() => {
	// 	const startedValueString = JSON.stringify(getValues(name) || '')
	// 	if (!startedValueString) return
	// 	const selectedOption = property.options.options.find((option) => JSON.stringify(option.value) === startedValueString)
	// 	if (selectedOption) setValue(`__temp__${name}`, selectedOption.label)
	// }, [])

	// useEffect(() => {
	// 	if (!initData?.label) return

	// 	setValue(name, initData.value)
	// 	setValue(`__temp__${name}`, initData.label)
	// 	trigger()
	// }, [initData])

	// const onChangeValue = (newLabel: string) => {
	// 	const value = property.options.options.find((option) => option.label === newLabel)
	// 	setValue(name, value?.value)
	// }

	// const onClickAddNewConnection = ()=>{}

	return (
		<>
			<Dialog>
				<FormField
					control={control}
					name={`__temp__${name}`}
					rules={{
						required: { value: true, message: 'Required field' },
					}}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{auth.displayName}</FormLabel>
							<FormControl>
								<Select
								// onValueChange={async (newValue) => {
								// onChangeValue(newValue)
								// /* add to end of callstack, can not witjout it becouse it brokes rendering  */
								// setTimeout(() => {
								// field.onChange(newValue)
								// }, 0)
								// }}
								>
									<SelectTrigger>
										<SelectValue placeholder="Select connection" aria-label={field.value}>
											{field.value}
										</SelectValue>
									</SelectTrigger>
									<SelectContent position="popper" className="max-h-96 overflow-scroll">
										<DialogTrigger asChild>
											<div key={'add-connection'}>
												<p className="'flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground font-bold hover:bg-accent">
													+ New Connection
												</p>
											</div>
										</DialogTrigger>
										{/* {property.options.options.map((option) => (
											<SelectItem value={option.label} key={option.value}>
												<span className="flex gap-2 items-center">
													<p>{option.label}</p>
												</span>
											</SelectItem>
										))} */}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<DialogContent className="sm:max-w-[425px]">
					<CreateAppConnection
						onCreateAppConnection={() => {
							//
						}}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
