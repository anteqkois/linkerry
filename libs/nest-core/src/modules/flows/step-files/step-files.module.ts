import { Module } from '@nestjs/common';
import { StepFilesService } from './step-files.service';
import { StepFilesController } from './step-files.controller';

@Module({
  controllers: [StepFilesController],
  providers: [StepFilesService]
})
export class StepFilesModule {}
