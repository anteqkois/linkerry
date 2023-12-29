import { Id, JwtUser } from '@market-connector/shared';
import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../lib/auth';
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator';
import { UpdateTriggerDto } from './dto/update-trigger.dto';
import { FlowVersionsService } from './flow-versions.service';

@Controller('flow-versions')
export class FlowVersionsController {
  constructor(private readonly flowVersionsService: FlowVersionsService) {

  }

  @UseGuards(JwtAuthGuard)
  @Patch('triggers/:id')
  updateFlowTrigger(@ReqJwtUser() user: JwtUser,  @Param('id') id: Id, @Body() dto: UpdateTriggerDto) {
    return this.flowVersionsService.updateTrigger(id, user.id, dto)
  }
}
