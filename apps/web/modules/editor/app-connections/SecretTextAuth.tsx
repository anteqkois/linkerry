import { ConnectorMetadata, SecretTextProperty } from '@linkerry/connectors-framework'
import { AppConnectionType, AppConnectionWithoutSensitiveData, isCustomHttpExceptionAxios } from '@linkerry/shared'
import {
	ButtonClient,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	useToast,
} from '@linkerry/ui-components/client'
import { Button } from '@linkerry/ui-components/server'
import dayjs from 'dayjs'
import { Dispatch, FormEvent, HTMLAttributes, SetStateAction, useState } from 'react'
import { useForm } from 'react-hook-form'
import { MarkdownBase } from '../../../shared/components/Markdown/MarkdownBase'
import { AppConnectionsApi } from '../../app-connections'
import { SecretTextField } from '../form/Inputs/SecretTextField'

export interface SecretTextAuthProps extends HTMLAttributes<HTMLElement> {
	onCreateAppConnection: (newConnection: AppConnectionWithoutSensitiveData) => void
	auth: SecretTextProperty
	connector: Pick<ConnectorMetadata, 'displayName' | 'name'>
	setShowDialog: Dispatch<SetStateAction<boolean>>
}
export const SecretTextAuth = ({ onCreateAppConnection, auth, connector, setShowDialog }: SecretTextAuthProps) => {
	const appConnectionForm = useForm({
		mode: 'all',
		defaultValues: {
			name: `${connector.name.replace('@linkerry/', '').toLocaleLowerCase()}-${dayjs().unix()}`,
			secretText: '',
		},
	})
	const [loading, setLoading] = useState(false)

	const { toast } = useToast()

	const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (!appConnectionForm.formState.isValid) return
		setLoading(true)
		appConnectionForm.clearErrors()

		const { name, secretText } = appConnectionForm.getValues()

		try {
			const { data } = await AppConnectionsApi.upsert({
				connectorName: connector.name,
				name: name,
				type: AppConnectionType.SECRET_TEXT,
				value: {
					type: AppConnectionType.SECRET_TEXT,
					secret_text: secretText,
				},
			})

			toast({
				title: `Connection ${data.name} was succesfully saved`,
				description: 'You can now use this connection through all of your flows.',
				variant: 'success',
			})

			onCreateAppConnection(data)
			setShowDialog(false)
		} catch (error: any) {
			if (isCustomHttpExceptionAxios(error))
				appConnectionForm.setError('root', {
					message: error.response.data.message,
				})
			else {
				appConnectionForm.setError('root', {
					message: 'Unknwon error occures, try again or inform our Team',
				})
			}
		} finally {
			setLoading(false)
		}
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>New Connection</DialogTitle>
				<DialogDescription>This connection will be able to be used by {connector.displayName} connector </DialogDescription>
			</DialogHeader>
			<Form {...appConnectionForm}>
				<form className="space-y-8" onSubmit={onSubmit}>
					<FormField
						control={appConnectionForm.control}
						name={'name'}
						rules={{
							required: { value: true, message: 'Required field' },
						}}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Connection Name</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					{auth.description ? (
						<MarkdownBase className="markdown w-full rounded-md border border-dashed border-input bg-card p-3 text-sm shadow-sm">
							{auth.description}
						</MarkdownBase>
					) : null}
					<div className="sm:max-w-[380px]">
						<SecretTextField property={{ ...auth, description: undefined }} name={'secretText'} key={'secretText'} refreshedProperties={[]} />
					</div>
					<div className="h-1">
						{appConnectionForm.formState.errors.root && <FormMessage>{appConnectionForm.formState.errors.root.message}</FormMessage>}
					</div>
					<DialogFooter>
						<Button onClick={() => setShowDialog(false)} disabled={loading} variant={'outline'}>
							Cancel
						</Button>
						<ButtonClient loading={loading} type="submit" disabled={!appConnectionForm.formState.isValid}>
							Save
						</ButtonClient>
					</DialogFooter>
				</form>
			</Form>
		</>
	)
}
