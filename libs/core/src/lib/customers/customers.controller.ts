import { Body, Controller, Get, Post } from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) { }

  @Get()
  getCustomer() { }

  @Post()
  createCustomer(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.createCustomer(createCustomerDto)
  }
}
