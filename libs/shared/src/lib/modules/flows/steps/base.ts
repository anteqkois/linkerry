import { ConnectorNameType, DateType, ShortStringType, StepNameType, VersionType } from '../../../common/type-validators'
import { ConnectorType, PackageType } from '../../connectors'

export const isStepBaseSettings = (settings: unknown): settings is BaseStepSettings => {
	// const response = typia.validate<BaseStepSettings>(settings)
	// return response.success
	return true
}

export interface SampleDataSettingsObject {
	currentSelectedData: unknown
	customizedInputs?: Record<string, any>
	lastTestDate: DateType
}
export interface BaseStep {
	name: StepNameType,
	displayName: ShortStringType,
	valid: boolean,
	// type: z.nativeEnum(ActionType).or(z.nativeEnum(TriggerType)),
	// nextActionName: z.string().optional(),
	nextActionName: StepNameType,
}
export interface BaseStepSettings {
	packageType: PackageType,
	connectorName: ConnectorNameType,
	connectorVersion: VersionType,
	connectorType: ConnectorType,
	input: Record<string, any> &  { auth? : string},
	inputUiInfo: SampleDataSettingsObject,
}
