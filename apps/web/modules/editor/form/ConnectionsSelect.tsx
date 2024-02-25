import { ConnectorAuthProperty, ConnectorMetadata } from '@linkerry/connectors-framework'
import { AppConnectionWithoutSensitiveData } from '@linkerry/shared'
import {
	Dialog,
	DialogContent,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue
} from '@linkerry/ui-components/client'
import { HTMLAttributes, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { getBrowserQueryCllient, useClientQuery } from '../../../libs/react-query'
import { appConnectionsQueryConfig } from '../../app-connections/query-configs'
import { CreateAppConnection } from '../app-connections/CreateAppConnection'

export interface ConnectionsSelectProps extends Omit<HTMLAttributes<HTMLElement>, 'property'> {
	auth: ConnectorAuthProperty
	connector: Pick<ConnectorMetadata, 'displayName' | 'name'>
}

export const ConnectionsSelect = ({ auth, connector }: ConnectionsSelectProps) => {
	const { setValue, control, trigger } = useFormContext()
	const [showDialog, setShowDialog] = useState(false)
	const { data: appConnections, isFetched } = useClientQuery(appConnectionsQueryConfig.getMany())

	const connectorConnections = useMemo(() => {
		if (!isFetched) return []
		trigger('auth')
		return appConnections?.filter((appConnection) => appConnection.connectorName === connector.name)
	}, [appConnections, isFetched])

	const handleAddedConnection = (newConnection: AppConnectionWithoutSensitiveData) => {
		const queryClient = getBrowserQueryCllient()
		queryClient.setQueryData(appConnectionsQueryConfig.getMany().queryKey, appConnections?.concat(newConnection))

		/* add to end of callback */
		setTimeout(() => {
			setValue('auth', `{{connections['${newConnection.name}']}}`)
		}, 0)
	}

	return (
		<>
			<FormField
				control={control}
				name={'auth'}
				rules={{
					required: { value: true, message: 'Required field' },
				}}
				render={({ field }) => (
					<FormItem>
						<FormLabel className="flex justify-between py-1">
							<span>{auth.displayName}</span>
							<div onClick={() => setShowDialog(true)} className="font-bold underline underline-offset-2 cursor-pointer hover:text-primary">
								+ New Connection
							</div>
						</FormLabel>
						<Select onValueChange={field.onChange} value={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder={field.value ? undefined : 'Select connection'} />
								</SelectTrigger>
							</FormControl>
							<SelectContent position="popper" className="max-h-96 overflow-scroll">
								{!connectorConnections?.length ? (
									<p className="'flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground">
										No connections avaible
									</p>
								) : (
									connectorConnections.map((appConnection) => (
										<SelectItem value={`{{connections['${appConnection.name}']}}`} key={appConnection.name}>
											<span className="flex gap-2 items-center">
												<p>{appConnection.name}</p>
											</span>
										</SelectItem>
									))
								)}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
			<Dialog open={showDialog} onOpenChange={setShowDialog}>
				<DialogContent className="sm:max-w-[425px]">
					<CreateAppConnection onCreateAppConnection={handleAddedConnection} auth={auth} connector={connector} setShowDialog={setShowDialog} />
				</DialogContent>
			</Dialog>
		</>
	)
}
