import { BaseDatabaseFields } from '@linkerry/shared'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'

@Schema({ _id: false })
export class BaseDatabaseModel implements BaseDatabaseFields {
  _id: string

  @Prop({ required: false, type: Date })
  createdAt: string

  @Prop({ required: false, type: Date })
  updatedAt: string
}
export const BaseDatabaseSchema = SchemaFactory.createForClass(BaseDatabaseModel)
