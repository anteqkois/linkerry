import { Controller } from '@nestjs/common';
import { CustomerSettingsService } from './customer-settings.service';

@Controller('customer-settings')
export class CustomerSettingsController {
  constructor(private readonly customerSettingsService: CustomerSettingsService) {}
}
