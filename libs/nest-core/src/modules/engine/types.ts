
import { ConnectorMetadata, DynamicPropsValue, StaticDropdownState } from '@linkerry/connectors-framework'
import {
	EngineResponseStatus,
	ExecuteActionResponse,
	ExecuteTriggerResponse,
	ExecuteValidateAuthResponse,
	ExecutionOutput,
	TriggerHookType
} from '@linkerry/shared'

export type EngineHelperFlowResult = ExecutionOutput

export type EngineHelperTriggerResult<T extends TriggerHookType = TriggerHookType> = ExecuteTriggerResponse<T>

export type EngineHelperPropResult = StaticDropdownState<unknown> | Record<string, DynamicPropsValue>

export type EngineHelperActionResult = ExecuteActionResponse

export type EngineHelperValidateAuthResult = ExecuteValidateAuthResponse

export type EngineHelperCodeResult = ExecuteActionResponse
export type EngineHelperExtractConnectorInformation = Omit<ConnectorMetadata, 'name' | 'version'>

export type EngineHelperResult =
	| EngineHelperFlowResult
	| EngineHelperTriggerResult
	| EngineHelperPropResult
	| EngineHelperCodeResult
	| EngineHelperExtractConnectorInformation
	| EngineHelperActionResult
	| EngineHelperValidateAuthResult

export type EngineHelperResponse<Result extends EngineHelperResult> = {
	status: EngineResponseStatus
	result: Result
	standardError: string
	standardOutput: string
}
