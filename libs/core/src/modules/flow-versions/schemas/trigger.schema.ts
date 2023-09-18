import { BaseConnectorSettings, SampleData, TriggerConnector, TriggerEmpty, TriggerType, TriggerWebhook } from '@market-connector/shared'
import { Prop, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel } from './base.schema'
import {  ConnectorSettingsSchema, SampleDataSchema } from './base.schema'

export class TriggerEmptyModel extends BaseStepModel implements TriggerEmpty {
  @Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.Empty })
  override type: TriggerType.Empty
}
export const TriggerEmptySchema = SchemaFactory.createForClass(TriggerEmptyModel)

export class TriggerWebhookModel extends BaseStepModel implements TriggerWebhook {
  @Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.Webhook })
  override type: TriggerType.Webhook

  @Prop({ required: true, type: { sampleData: SampleDataSchema } })
  settings: {
    sampleData: SampleData
  }
}
export const TriggerWebhookSchema = SchemaFactory.createForClass(TriggerWebhookModel)

export class TriggerConnectorModel extends BaseStepModel implements TriggerConnector {
  @Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.Webhook })
  override type: TriggerType.Connector

  @Prop({ required: true, type: ConnectorSettingsSchema })
  settings: BaseConnectorSettings
}
export const TriggerConnectorSchema = SchemaFactory.createForClass(TriggerConnectorModel)
