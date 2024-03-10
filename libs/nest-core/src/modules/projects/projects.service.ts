import { DatabseModelInput, Id, Project } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { ProjectsModel } from './schemas/projects.schema'

@Injectable()
export class ProjectsService {
	constructor(@InjectModel(ProjectsModel.name) private readonly projectsModel: Model<ProjectsModel>) {
		//
	}

	async findManyUserProjects(userId: Id) {
		return this.projectsModel.find({
			users: {
				$in: [userId],
			},
		})
	}

	async create(input: DatabseModelInput<Project>) {
		return this.projectsModel.create(input)
	}
}
