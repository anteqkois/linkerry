import { Price, priceSchema } from '@linkerry/shared'
import { Controller, Post, UseGuards } from '@nestjs/common'
import { AdminGuard } from '../../../../lib/auth/guards/admin.guard'
import { BodySchema } from '../../../../lib/nest-utils/decorators/zod/body.decorator'
import { PricesService } from './prices.service'

@Controller('admin/prices')
export class PricesAdminController {
  constructor(private readonly pricesService: PricesService) {}

  @UseGuards(AdminGuard)
  @Post()
  create(@BodySchema(priceSchema) body: Price) {
    return this.pricesService.create(body)
  }
}
