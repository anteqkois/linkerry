import { User } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { FilterQuery, Model } from 'mongoose'
import { HashService } from '../../lib/auth/hash.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserDocument, UserModel } from './schemas/user.schema'

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(@InjectModel(UserModel.name) private userModel: Model<UserDocument>, private readonly hashService: HashService) {}

	async create(createUserDto: CreateUserDto) {
		return this.userModel.create(createUserDto)
	}

	async findOne(filter: FilterQuery<User>) {
		return this.userModel.findOne(filter)
	}

	async findOneWithPassword(filters: { email?: string; id?: string }) {
		return this.userModel.findOne(filters)
	}
}
