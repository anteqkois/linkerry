import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { MongodbModule } from '../mongodb';
import { MongooseModule } from '@nestjs/mongoose';
import { Customer, CustomerSchema } from './schemas/customer.schema';

@Module({
  imports: [MongodbModule, MongooseModule.forFeatureAsync([{
    name: Customer.name,
    useFactory: () => {
      const schema = CustomerSchema;
      schema.plugin(require('mongoose-unique-validator'), { message: 'Email or nick exists' }); // or you can integrate it without the options   schema.plugin(require('mongoose-unique-validator')
      return schema;
    },
  },])],
  controllers: [CustomersController],
  providers: [CustomersService]
})
export class CustomersModule { }
