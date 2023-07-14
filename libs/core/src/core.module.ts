import { Module } from '@nestjs/common';
import { KafkaModule } from './lib/kafka/kafka.module';
import { CustomersModule } from './lib/customers/customer.module';
import { CustomerSettingsModule } from './lib/customer-settings/customer-settings.module';
import { AlertsModule } from './lib/alerts/alerts.module';
import { AuthModule } from './lib/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './lib/customers';

@Module({
  imports: [
    KafkaModule,
    CustomersModule,
    CustomerSettingsModule,
    AlertsModule,
    AuthModule,
    // MongooseModule.forFeatureAsync([{
    //   name: Customer.name,
    //   useFactory: () => {
    //     const schema = CustomerSchema;
    //     schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
    //     return schema;
    //   },
    // },])
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class CoreModule { }
