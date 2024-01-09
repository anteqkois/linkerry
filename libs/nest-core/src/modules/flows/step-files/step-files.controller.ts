import { Controller } from '@nestjs/common';
import { StepFilesService } from './step-files.service';

@Controller('step-files')
export class StepFilesController {
  constructor(private readonly stepFilesService: StepFilesService) {}
}
