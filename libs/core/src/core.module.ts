import { Module } from '@nestjs/common';
import { KafkaModule } from './lib/kafka/kafka.module';
import { CustomersModule } from './lib/customers/customer.module';

@Module({
  imports: [
    KafkaModule,
    CustomersModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule { }
