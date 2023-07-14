import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserRoleTypes } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) { }

  async createUser(createUserDto: CreateUserDto) {
    try {
      const encryptedPassword = createUserDto.password
      createUserDto.password = encryptedPassword

      const customr = await this.userModel.create({ ...createUserDto, roles: [UserRoleTypes.CUSTOMER] })
      return customr
    } catch (error) {
      console.log(error);
      return new UnprocessableEntityException()
    }
  }

  async find(filters?: any) {
    const filter = {}
    return this.userModel.find(filter)
  }

  async findOne(name: string) {
    return this.userModel.findOne({ name })
  }
}
