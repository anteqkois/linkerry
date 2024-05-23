import {
  ActionType,
  BaseStep,
  BaseStepSettings,
  ConnectorType,
  PackageType,
  SampleData,
  SampleDataSettingsObject,
  TriggerType,
} from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types } from 'mongoose'

@Schema({ _id: false })
export class SampleDataModel implements SampleData {
  @Prop({ required: false, type: Object })
  currentSelectedData: unknown

  @Prop({ required: false, type: Object })
  customizedInputs: Record<string, any>

  @Prop({ required: false, type: Date })
  lastTestDate: Date
}

export const SampleDataSchema = SchemaFactory.createForClass(SampleDataModel)

@Schema({ _id: false })
export class SampleDataSettingsObjectModel implements SampleDataSettingsObject {
  @Prop({ required: false, type: Object })
  currentSelectedData: unknown

  @Prop({ required: false, type: Object })
  customizedInputs: Record<string, any>

  @Prop({ required: false, type: Date })
  lastTestDate: string
}

export const SampleDataSettingsObjectSchema = SchemaFactory.createForClass(SampleDataSettingsObjectModel)

@Schema({ _id: false })
export class StepSettingsModel implements BaseStepSettings {
  @Prop({ required: true, type: String })
  connectorName: string

  @Prop({ required: true, type: String })
  connectorVersion: string

  @Prop({ required: true, type: String, enum: ConnectorType })
  connectorType: ConnectorType

  @Prop({ required: true, type: Object })
  input: Record<string, any> & { auth?: string | undefined }

  @Prop({ required: true, type: SampleDataSettingsObjectSchema })
  inputUiInfo: SampleDataSettingsObject

  @Prop({ required: true, type: String, enum: PackageType })
  packageType: PackageType
}
export const ConnectorSettingsSchema = SchemaFactory.createForClass(StepSettingsModel)

export class BaseStepModel implements BaseStep {
  @Prop({ required: true, type: String })
  displayName: string

  @Prop({ required: true, type: Types.ObjectId })
  name: string

  @Prop({ required: true, type: String })
  type: ActionType | TriggerType

  @Prop({ required: true, type: Boolean, default: false })
  valid: boolean

  @Prop({ required: false, type: String, default: '' })
  nextActionName: string
}
