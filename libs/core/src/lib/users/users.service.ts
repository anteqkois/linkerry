import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import { UserRoleTypes } from './types';
import { HashService } from '../auth/hash.service';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
    private readonly logger: LoggerService,
  ) {
    logger.setContext(UsersService.name)
  }

  async createUser(createUserDto: CreateUserDto) {

    try {
      const hashedPassword = await this.hashService.hash(createUserDto.password)
      createUserDto.password = hashedPassword

      const customr = await this.userModel.create({ ...createUserDto, roles: [UserRoleTypes.CUSTOMER] })
      this.logger.debug('New user created')
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
