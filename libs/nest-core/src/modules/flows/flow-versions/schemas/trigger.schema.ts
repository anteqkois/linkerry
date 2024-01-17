import { BaseConnectorSettings, SampleData, TriggerConnector, TriggerEmpty, TriggerType, TriggerWebhook } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel, ConnectorSettingsSchema, SampleDataSchema } from './base.schema'

@Schema({ _id: false, discriminatorKey: 'type' })
export class TriggerEmptyModel extends BaseStepModel implements TriggerEmpty {
  @Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.Empty })
  override type: TriggerType.Empty
}
export const TriggerEmptySchema = SchemaFactory.createForClass(TriggerEmptyModel)

@Schema({ _id: false, discriminatorKey: 'type' })
export class TriggerWebhookModel extends BaseStepModel implements TriggerWebhook {
  @Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.Webhook })
  override type: TriggerType.Webhook

  @Prop({ required: false, type: { sampleData: SampleDataSchema } })
  settings: {
    sampleData: SampleData
  }
}
export const TriggerWebhookSchema = SchemaFactory.createForClass(TriggerWebhookModel)

@Schema({ _id: false, discriminatorKey: 'type' })
export class TriggerConnectorModel extends BaseStepModel implements TriggerConnector {
  @Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.Webhook })
  override type: TriggerType.Connector

  @Prop({ required: false, type: ConnectorSettingsSchema })
  settings: BaseConnectorSettings
}
export const TriggerConnectorSchema = SchemaFactory.createForClass(TriggerConnectorModel)
