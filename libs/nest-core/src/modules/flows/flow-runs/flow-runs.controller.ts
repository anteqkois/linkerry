import { Controller } from '@nestjs/common';
import { FlowRunsService } from './flow-runs.service';

@Controller('flow-runs')
export class FlowRunsController {
  constructor(private readonly flowRunsService: FlowRunsService) {}
}
