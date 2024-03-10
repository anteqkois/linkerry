import { DatabaseTimestamp } from "@linkerry/shared";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({ _id: false })
export class TimestampDatabaseModel implements DatabaseTimestamp {
	@Prop({ required: false, type: Date })
	createdAt: string;

	@Prop({ required: false, type: Date })
	updatedAt: string;
}
export const TimestampDatabaseSchema = SchemaFactory.createForClass(TimestampDatabaseModel)
