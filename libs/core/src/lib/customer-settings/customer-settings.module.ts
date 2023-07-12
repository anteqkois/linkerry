import { Module } from '@nestjs/common';
import { CustomerSettingsService } from './customer-settings.service';
import { CustomerSettingsController } from './customer-settings.controller';

@Module({
  controllers: [CustomerSettingsController],
  providers: [CustomerSettingsService]
})
export class CustomerSettingsModule {}
