import { Controller } from '@nestjs/common';
import { FlowVersionsService } from './flow-versions.service';

@Controller('flow-versions')
export class FlowVersionsController {
  constructor(private readonly flowVersionsService: FlowVersionsService) {}
}
