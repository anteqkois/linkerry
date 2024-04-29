import { Id, NotificationStatus, Project, User } from '@linkerry/shared'
import { AsyncModelFactory, Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose from 'mongoose'
import mongooseUniqueValidator from 'mongoose-unique-validator'
import { BaseDatabaseModel, IdObjectOrPopulated } from '../../../lib/mongodb'
import { UserModel } from '../../users/schemas/user.schema'

export type ProjectDocument<T extends keyof Project = never> = mongoose.HydratedDocument<ProjectModel<T>>

@Schema({ timestamps: true, autoIndex: true, collection: 'projects' })
export class ProjectModel<T = ''> extends BaseDatabaseModel implements Omit<Project, 'owner' | '_id'> {
	@Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: UserModel.name })
	owner: IdObjectOrPopulated<T, 'owner', User>

	@Prop({ required: true, type: [mongoose.Schema.Types.ObjectId], ref: UserModel.name })
	users: Id[]

	@Prop({ required: true, type: String })
	displayName: string

	@Prop({ required: true, type: String, enum: NotificationStatus })
	notifyStatus: NotificationStatus
}

export const ProjectsSchema = SchemaFactory.createForClass(ProjectModel)

export const ProjectModelFactory: AsyncModelFactory = {
	name: ProjectModel.name,
	imports: [],
	useFactory: () => {
		const schema = ProjectsSchema
		schema.plugin(mongooseUniqueValidator, { message: 'Error, expected {PATH} to be unique. Received {VALUE}' })
		return schema
	},
	inject: [],
}
