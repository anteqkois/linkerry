import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import { CustomerRoleTypes } from './types';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name) private customerModel: Model<CustomerDocument>,
  ) { }

  async createCustomer(createCustomerDto: CreateCustomerDto) {
    try {
      const encryptedPassword = createCustomerDto.password
      createCustomerDto.password = encryptedPassword

      const customr = await this.customerModel.create({ ...createCustomerDto, roles: [CustomerRoleTypes.CUSTOMER] })
      return customr
    } catch (error) {
      console.log(error);
      return new UnprocessableEntityException()
    }
  }

  async find(filters?: any) {
    const filter = {}
    return this.customerModel.find(filter)
  }

  async findOne(name: string) {
    return this.customerModel.findOne({ name })
  }
}
