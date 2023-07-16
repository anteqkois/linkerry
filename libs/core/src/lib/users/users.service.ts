import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { HashService } from '../auth/hash.service';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto)
  }

  async find(filters?: any) {
    const filter = {}
    return this.userModel.find(filter)
  }

  async findOne(filters: { name?: string, id?: string }) {
    return this.userModel.findOne(filters, { password: 0 })
  }

  async findOneWithPassword(filters: { name?: string, id?: string }) {
    return this.userModel.findOne(filters)
  }
}
