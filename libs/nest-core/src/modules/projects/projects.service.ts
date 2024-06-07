import { DatabseModelInput, Id, Project } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { ProjectDocument, ProjectModel } from './schemas/projects.schema'

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(ProjectModel.name) private readonly projectsModel: Model<ProjectModel>) {
    //
  }

  async findManyUserProjects(userId: Id) {
    return this.projectsModel.find({
      userIds: {
        $in: [userId],
      },
    })
  }

  async create(input: DatabseModelInput<Project>) {
    return this.projectsModel.create(input)
  }

  async findOne(filter: FilterQuery<ProjectDocument>) {
    return this.projectsModel.findOne(filter)
  }
}
