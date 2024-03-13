import { ActionConnector, ActionConnectorSettings, ActionType } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel, StepSettingsModel } from './base.schema'

@Schema({ _id: false })
export class ActionSettingsModel extends StepSettingsModel implements ActionConnectorSettings {
	@Prop({ required: true, type: String })
	actionName: string
}
export const ActionConnectorSettingsSchema = SchemaFactory.createForClass(ActionSettingsModel)

@Schema({ _id: false })
export class ActionConnectorModel extends BaseStepModel implements ActionConnector {
	@Prop({ required: true, type: String, enum: ActionType, default: ActionType.CONNECTOR })
	override type: ActionType.CONNECTOR

	@Prop({ required: false, type: ActionConnectorSettingsSchema })
	settings: ActionConnectorSettings
}
export const ActionConnectorSchema = SchemaFactory.createForClass(ActionConnectorModel)
