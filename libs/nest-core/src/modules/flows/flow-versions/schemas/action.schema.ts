import { ActionConnector, ActionType, BaseConnectorSettings } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel, ConnectorSettingsSchema } from './base.schema'

@Schema({ _id: false })
export class ActionConnectorModel extends BaseStepModel implements ActionConnector {
  @Prop({ required: true, type: String, enum: ActionType, default: ActionType.CONNECTOR })
  override type: ActionType.CONNECTOR

	@Prop({ required: false, type: ConnectorSettingsSchema })
  settings: BaseConnectorSettings
}
export const ActionConnectorSchema = SchemaFactory.createForClass(ActionConnectorModel)
// ActionConnectorSchema.add({
//   // @ts-ignore
//   nextAction: ActionConnectorSchema,
// })
