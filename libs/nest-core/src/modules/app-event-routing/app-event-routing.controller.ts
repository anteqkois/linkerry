import { Controller } from '@nestjs/common'
import { AppEventRoutingService } from './app-event-routing.service'

@Controller('app-event-routing')
export class AppEventRoutingController {
  constructor(private readonly appEventRoutingService: AppEventRoutingService) {}
}
