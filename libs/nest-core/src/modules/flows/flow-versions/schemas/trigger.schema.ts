import { SampleData, TriggerConnector, TriggerConnectorSettings, TriggerEmpty, TriggerType, TriggerWebhook } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { BaseStepModel, ConnectorSettingsModel, SampleDataSchema } from './base.schema'

/* EMPTY */
@Schema({ _id: false, discriminatorKey: 'type' })
export class TriggerEmptyModel extends BaseStepModel implements TriggerEmpty {
	@Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.EMPTY })
	override type: TriggerType.EMPTY
}
export const TriggerEmptySchema = SchemaFactory.createForClass(TriggerEmptyModel)

/* WEBHOOK */
@Schema({ _id: false, discriminatorKey: 'type' })
export class TriggerWebhookModel extends BaseStepModel implements TriggerWebhook {
	@Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.WEBHOOK })
	override type: TriggerType.WEBHOOK

	@Prop({ required: false, type: { sampleData: SampleDataSchema } })
	settings: {
		sampleData: SampleData
	}
}
export const TriggerWebhookSchema = SchemaFactory.createForClass(TriggerWebhookModel)

/* CONNECTOR */
@Schema({ _id: false })
export class TriggerConnectorSettingsModel extends ConnectorSettingsModel implements TriggerConnectorSettings {
	@Prop({ required: true, type: String })
	triggerName: string
}
export const TriggerConnectorSettingsSchema = SchemaFactory.createForClass(TriggerConnectorSettingsModel)

@Schema({ _id: false, discriminatorKey: 'type' })
export class TriggerConnectorModel extends BaseStepModel implements TriggerConnector {
	@Prop({ required: true, type: String, enum: TriggerType, default: TriggerType.WEBHOOK })
	override type: TriggerType.CONNECTOR

	@Prop({ required: false, type: TriggerConnectorSettingsSchema })
	settings: TriggerConnectorSettings
}
export const TriggerConnectorSchema = SchemaFactory.createForClass(TriggerConnectorModel)
