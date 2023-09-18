import { ActionConnector, ActionType } from '@market-connector/shared'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel } from './base.schema'

export class ActionConnectorModel extends BaseStepModel implements ActionConnector {
  @Prop({ required: true, type: String, enum: ActionType, default: ActionType.Connector })
  override type: ActionType.Connector
}
export const ActionConnectorSchema = SchemaFactory.createForClass(ActionConnectorModel)
ActionConnectorSchema.add({
  // @ts-ignore
  nextAction: ActionConnectorSchema,
})
