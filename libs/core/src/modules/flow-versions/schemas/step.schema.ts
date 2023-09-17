import { Step, StepAction, StepSettings, StepTrigger, StepType } from '@market-connector/shared'
import { Prop, SchemaFactory } from '@nestjs/mongoose'

class StepModel implements Step {
  @Prop({ required: true, type: String, unique: true })
  displayName: string

  @Prop({ required: true, type: String, unique: true })
  name: string

  @Prop({ required: true, type: String, unique: true })
  settings: StepSettings

  @Prop({ required: true, type: String, enum: StepType })
  type: StepType

  @Prop({ required: true, type: Boolean, default: false })
  valid: boolean
}

class StepActionModel extends StepModel implements StepAction {
  @Prop({ required: true, type: String, enum: StepType, default: StepType.Action })
  override type: StepType.Action

  @Prop({ required: true, type: SchemaFactory.createForClass(StepActionModel) })
  nextAction?: StepAction | undefined
}
const StepActionSchema = SchemaFactory.createForClass(StepActionModel)

export class StepTriggerModel extends StepModel implements StepTrigger {
  @Prop({ required: true, type: String, enum: StepType, default: StepType.Trigger })
  override type: StepType.Trigger

  @Prop({ required: true, type: StepActionSchema })
  nextAction?: StepAction
}
export const StepTriggerSchema = SchemaFactory.createForClass(StepTriggerModel)
