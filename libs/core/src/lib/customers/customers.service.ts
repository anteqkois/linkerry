import { Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  createCustomer(createCustomerDto: CreateCustomerDto) {
    console.log('[NEW CUSTOMER]', createCustomerDto);

  }
}
