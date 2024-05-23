import { Id } from '@linkerry/shared'
import { Controller, Get } from '@nestjs/common'
import { ParamIdSchema } from '../../../../lib/nest-utils/decorators/zod/id.decorator'
import { PricesService } from './prices.service'

@Controller('prices')
export class PricesController {
  constructor(private readonly pricesService: PricesService) {}

  @Get()
  findMany() {
    return this.pricesService.findMany()
  }

  @Get(':id')
  findOne(@ParamIdSchema() id: Id) {
    return this.pricesService.findOne(id)
  }
}
