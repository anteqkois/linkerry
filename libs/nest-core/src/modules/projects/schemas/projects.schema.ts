import { AppConnectionEncrypted, Id, NotificationStatus, Project } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import { UserModel } from '../../users/schemas/user.schema'

export type ProjectsDocument = mongoose.HydratedDocument<AppConnectionEncrypted>

@Schema({ timestamps: true, autoIndex: true, collection: 'projects' })
export class ProjectsModel implements Project {
	_id: string

	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserModel.name })
	ownerId: Id

	@Prop({ required: true, type: [mongoose.Schema.Types.ObjectId], ref: UserModel.name })
	users: Id[]

	@Prop({ required: true, type: String })
	displayName: string

	@Prop({ required: true, type: String, enum: NotificationStatus })
	notifyStatus: NotificationStatus
}

export const ProjectsSchema = SchemaFactory.createForClass(ProjectsModel)

export const ProjectsModelFactory: AsyncModelFactory = {
	name: ProjectsModel.name,
	imports: [],
	useFactory: () => {
		const schema = ProjectsSchema
		schema.plugin(require('mongoose-unique-validator'), { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
