import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { ProjectModelFactory } from './schemas/projects.schema'

@Module({
	imports: [MongooseModule.forFeatureAsync([ProjectModelFactory])],
	controllers: [ProjectsController],
	providers: [ProjectsService],
	exports: [ProjectsService],
})
export class ProjectsModule {}
