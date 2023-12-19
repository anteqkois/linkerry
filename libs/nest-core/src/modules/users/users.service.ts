import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from '../../lib/auth/hash.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDocument, UserModel } from './schemas/user.schema';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
    private readonly hashService: HashService,
  ) { }

  async create(createUserDto: CreateUserDto) {
    return await this.userModel.create(createUserDto)
  }

  async find(filers?: any) {
    const filter = {}
    return this.userModel.find(filter)
  }

  async findOne(filters: { name?: string, id?: string }) {
    return this.userModel.findOne(filters, { password: 0 })
  }

  async findOneWithPassword(filters: { email?: string, id?: string }) {
    return this.userModel.findOne(filters)
  }
}