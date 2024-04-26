import { Price } from '@linkerry/shared';
import { TypedBody, TypedRoute } from "@nestia/core";
import { Controller, UseGuards } from '@nestjs/common';
import { AdminGuard } from '../../../../lib/auth/guards/admin.guard';
import { PricesService } from './prices.service';

@Controller('admin/prices')
export class PricesAdminController {
	constructor(private readonly pricesService: PricesService) {}

	@UseGuards(AdminGuard)
	@TypedRoute.Post()
	create(@TypedBody() body: Omit<Price, '_id'>) {
		return this.pricesService.create(body)
	}
}
