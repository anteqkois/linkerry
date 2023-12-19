import { Action, ActionType, BaseConnectorSettings, BaseStep, SampleData, TriggerType } from '@market-connector/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class SampleDataModel implements SampleData {
  @Prop({ required: false, type: Object })
  currentSelectedData: unknown

  @Prop({ required: false, type: Date })
  lastTestDate: Date
}

export const SampleDataSchema = SchemaFactory.createForClass(SampleDataModel)

@Schema({ _id: false })
export class ConnectorSettingsModel implements BaseConnectorSettings {
  @Prop({ required: true, type: String })
  connectorName: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: Object })
  input: Record<string, any> & { auth?: string | undefined }

  @Prop({ required: true, type: SampleDataSchema })
  sampleData: SampleData

  @Prop({ required: true, type: String })
  version: string
}
export const ConnectorSettingsSchema = SchemaFactory.createForClass(ConnectorSettingsModel)

export class BaseStepModel implements BaseStep {
  @Prop({ required: true, type: String })
  displayName: string

  @Prop({ required: true, type: String })
  name: string

  @Prop({ required: true, type: String })
  type: ActionType | TriggerType

  @Prop({ required: true, type: Boolean, default: false })
  valid: boolean

  @Prop({ required: false, type: {} })
  nextAction?: Action | undefined
}
