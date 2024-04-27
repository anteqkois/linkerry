import { Id, User, assertNotNullOrUndefined } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { InjectModel } from '@nestjs/mongoose'
import { createHmac } from 'crypto'
import { FilterQuery, Model } from 'mongoose'
// import { CreateUserDto } from './dto/create-user.dto'
import { UserDocument, UserModel } from './schemas/user.schema'

@Injectable()
export class UsersService {
	private readonly logger = new Logger(UsersService.name)

	constructor(@InjectModel(UserModel.name) private userModel: Model<UserDocument>, private readonly configService: ConfigService) {}

	async findOne(filter: FilterQuery<User>) {
		return this.userModel.findOne(filter)
	}

	async findOneWithPassword(filters: { email?: string; _id?: string }) {
		return this.userModel.findOne(filters)
	}

	async getLiveChatUserHash(userId: Id) {
		const user = await this.findOneWithPassword({
			_id: userId,
		})
		assertNotNullOrUndefined(user, 'user')
		const hmac = createHmac('sha256', this.configService.getOrThrow('TAWK_API_KEY'))
		hmac.update(user.email)
		const hash = hmac.digest('hex')
		return hash
	}
}
