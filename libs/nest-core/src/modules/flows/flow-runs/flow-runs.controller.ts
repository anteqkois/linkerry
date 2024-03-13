import { Controller } from '@nestjs/common';
import { FlowRunsService } from './flow-runs.service';

// TODO don't forget about tags search
@Controller('flow-runs')
export class FlowRunsController {
  constructor(private readonly flowRunsService: FlowRunsService) {}
}
