import { ActionConnector, ActionType } from '@market-connector/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel } from './base.schema'

@Schema({ _id: false })
export class ActionConnectorModel extends BaseStepModel implements ActionConnector {
  @Prop({ required: true, type: String, enum: ActionType, default: ActionType.Connector })
  override type: ActionType.Connector
}
export const ActionConnectorSchema = SchemaFactory.createForClass(ActionConnectorModel)
// ActionConnectorSchema.add({
//   // @ts-ignore
//   nextAction: ActionConnectorSchema,
// })
