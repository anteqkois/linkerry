import { Module } from '@nestjs/common';
import { KafkaModule } from './lib/kafka/kafka.module';
import { CustomersModule } from './lib/customers/customer.module';
import { CustomerSettingsModule } from './lib/customer-settings/customer-settings.module';

@Module({
  imports: [
    KafkaModule,
    CustomersModule,
    CustomerSettingsModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule { }
