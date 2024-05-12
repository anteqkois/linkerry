import {
  ConnectorMetadata,
  ConnectorPropertyMap,
  DynamicDropdownProperty,
  DynamicDropdownState,
  DynamicProperties,
  PropertyContext,
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
	async executeProps({
		params,
		connectorsSource,
		constants,
		executionState,
		searchValue,
	}: {
		searchValue?: string,
		executionState: FlowExecutorContext
		params: ExecutePropsOptions
		connectorsSource: string
		constants: EngineConstants
	}) {
		const property = await connectorLoader.getPropOrThrow({
			params,
			connectorsSource,
		})

		try {
			const { resolvedInput } = await variableService({
				projectId: params.projectId,
				workerToken: params.workerToken,
			}).resolve<StaticPropsValue<ConnectorPropertyMap>>({
				unresolvedInput: params.input,
				executionState,
				// executionState: FlowExecutorContext.empty(),
			})
			const ctx: PropertyContext = {
				searchValue,
				server: {
					token: params.workerToken,
					apiUrl: EngineConstants.API_URL,
					publicUrl: params.serverUrl,
				},
				project: {
					id: params.projectId,
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
		connectorsSource,
	}: {
		params: ExecuteValidateAuthOperation
		connectorsSource: string
	}): Promise<ExecuteValidateAuthResponse> {
		const { connector: connectorPackage } = params

		const connector = await connectorLoader.loadConnectorOrThrow({
			connectorName: connectorPackage.connectorName,
			connectorVersion: connectorPackage.connectorVersion,
			connectorsSource,
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
		connectorsSource,
		params,
	}: {
		connectorsSource: string
		params: ExecuteExtractConnectorMetadata
		// TODO devide ConnectorMetadata type to not include '_id' | 'group' | 'connectorType' | 'packageType' etc
	}): Promise<Omit<ConnectorMetadata, '_id' | 'group' | 'connectorType' | 'packageType'>> {
		const { connectorName, connectorVersion } = params
		const connector = await connectorLoader.loadConnectorOrThrow({ connectorName, connectorVersion, connectorsSource })

		return {
			...connector.metadata(),
			name: connectorName,
			version: connectorVersion,
		}
	},
}
