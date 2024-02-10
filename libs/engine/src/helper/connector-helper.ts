import {
	ConnectorMetadata,
	ConnectorPropertyMap,
	DynamicDropdownProperty,
	DynamicDropdownState,
	DynamicProperties,
	PropertyType,
	StaticPropsValue,
} from '@linkerry/connectors-framework'
import {
	BasicAuthConnectionValue,
	CustomAuthConnectionValue,
	ExecuteExtractConnectorMetadata,
	ExecutePropsOptions,
	ExecuteValidateAuthOperation,
	ExecuteValidateAuthResponse,
	SecretTextConnectionValue,
} from '@linkerry/shared'
import { EngineConstants } from '../handler/context/engine-constants'
import { FlowExecutorContext } from '../handler/context/flow-execution-context'
import { variableService } from '../services/veriables.service'
import { connectorLoader } from './connector-loader'

export const connectorHelper = {
	// to retrive options
	async executeProps({ params, connectorSource }: { params: ExecutePropsOptions; connectorSource: string }) {
		const property = await connectorLoader.getPropOrThrow({
			params,
			connectorSource,
		})

		try {
			const { resolvedInput } = await variableService({
				// projectId: params.projectId,
				workerToken: params.workerToken,
			}).resolve<StaticPropsValue<ConnectorPropertyMap>>({
				unresolvedInput: params.input,
				executionState: FlowExecutorContext.empty(),
			})
			const ctx = {
				server: {
					token: params.workerToken,
					apiUrl: EngineConstants.API_URL,
					publicUrl: params.serverUrl,
				},
			}

			if (property.type === PropertyType.DYNAMIC) {
				const dynamicProperty = property as DynamicProperties<boolean>
				return await dynamicProperty.props(resolvedInput, ctx)
			}

			// if (property.type === PropertyType.MULTI_SELECT_DROPDOWN) {
			//     const multiSelectProperty = property as MultiSelectDropdownProperty<
			//     unknown,
			//     boolean
			//     >
			//     return await multiSelectProperty.options(resolvedInput, ctx)
			// }

			const dropdownProperty = property as DynamicDropdownProperty<any, boolean>

			console.log(dropdownProperty)
			console.log(await dropdownProperty.options(resolvedInput, ctx))
			return await dropdownProperty.options(resolvedInput, ctx)
		} catch (e) {
			console.error(e)
			return {
				disabled: true,
				options: [],
				placeholder: 'Throws an error, reconnect or refresh the page',
			} as DynamicDropdownState<unknown>
		}
	},

	async executeValidateAuth({
		params,
		connectorSource,
	}: {
		params: ExecuteValidateAuthOperation
		connectorSource: string
	}): Promise<ExecuteValidateAuthResponse> {
		const { connector: connectorPackage } = params

		const connector = await connectorLoader.loadConnectorOrThrow({
			connectorName: connectorPackage.connectorName,
			connectorVersion: connectorPackage.connectorVersion,
			connectorSource,
		})
		if (connector.auth?.validate === undefined) {
			return {
				valid: true,
			}
		}

		switch (connector.auth.type) {
			case PropertyType.BASIC_AUTH: {
				const con = params.auth as BasicAuthConnectionValue
				return connector.auth.validate({
					auth: {
						username: con.username,
						password: con.password,
					},
				})
			}
			case PropertyType.SECRET_TEXT: {
				const con = params.auth as SecretTextConnectionValue
				return connector.auth.validate({
					auth: con.secret_text,
				})
			}
			case PropertyType.CUSTOM_AUTH: {
				const con = params.auth as CustomAuthConnectionValue
				return connector.auth.validate({
					auth: con.props,
				})
			}
			default: {
				throw new Error('Invalid auth type')
			}
		}
	},

	async extractConnectorMetadata({
		connectorSource,
		params,
	}: {
		connectorSource: string
		params: ExecuteExtractConnectorMetadata
	}): Promise<Omit<ConnectorMetadata, '_id' | 'group' | 'connectorType'>> {
		const { connectorName, connectorVersion } = params
		const connector = await connectorLoader.loadConnectorOrThrow({ connectorName, connectorVersion, connectorSource })

		return {
			...connector.metadata(),
			name: connectorName,
			version: connectorVersion,
		}
	},
}
