import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { StepFileModelFactory } from './schemas/file'
import { StepFilesController } from './step-files.controller'
import { StepFilesService } from './step-files.service'

@Module({
	imports: [MongooseModule.forFeatureAsync([StepFileModelFactory])],
	controllers: [StepFilesController],
	providers: [StepFilesService],
	exports: [StepFilesService],
})
export class StepFilesModule {}
