import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { ProjectsModelFactory } from './schemas/projects.schema'

@Module({
	imports: [MongooseModule.forFeatureAsync([ProjectsModelFactory])],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [ProjectsService],
})
export class ProjectsModule {}
