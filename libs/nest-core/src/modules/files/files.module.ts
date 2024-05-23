import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { FilesController } from './files.controller'
import { FilesService } from './files.service'
import { FileModelFactory } from './schemas/files.schema'

@Module({
  imports: [MongooseModule.forFeatureAsync([FileModelFactory])],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
