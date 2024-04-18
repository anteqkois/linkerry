import { InjectRedis } from '@liaoliaots/nestjs-redis'
import { VerificationEmail } from '@linkerry/react-email'
import {
	CustomError,
	ErrorCode,
	Id,
	JWTPrincipalType,
	JwtWorkerTokenPayload,
	NotificationStatus,
	User,
	UserRole,
	assertNotNullOrUndefined,
} from '@linkerry/shared'
import { Injectable, Logger, UnprocessableEntityException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import dayjs from 'dayjs'
import { Redis } from 'ioredis'
import { Model } from 'mongoose'
import { HashService } from '../../../lib/auth/hash.service'
import { JWTCustomService } from '../../../lib/auth/jwt-custom.service'
import { SubscriptionsService } from '../../billing/subscriptions/subscriptions.service'
import { REDIS_CLIENT_NAMESPACE, REDIS_KEYS } from '../../configs/redis'
import { EmailService } from '../../notifications/email/email.service'
import { ProjectsService } from '../../projects/projects.service'
import { UserDocument, UserModel } from '../schemas/user.schema'
import { UsersService } from '../users.service'
import { SignUpDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
	private readonly EMAIL_CODE_VERIFICATION_EXPIRE_MS
	private readonly logger = new Logger(AuthService.name)

	constructor(
		@InjectRedis(REDIS_CLIENT_NAMESPACE.SERVER) private readonly redis: Redis,
		@InjectModel(UserModel.name) private readonly userModel: Model<UserDocument>,
		private readonly usersService: UsersService,
		private readonly jwtCustomService: JWTCustomService,
		private readonly hashService: HashService,
		private readonly projectsService: ProjectsService,
		private readonly jwtService: JwtService,
		private readonly subscriptionsService: SubscriptionsService,
		private readonly emailService: EmailService,
		private readonly configService: ConfigService,
	) {
		this.EMAIL_CODE_VERIFICATION_EXPIRE_MS = configService.getOrThrow('EMAIL_CODE_VERIFICATION_EXPIRE_MS')
	}

	private async _sendVerificationCode({ userId, emailAdsress }: { userId: Id; emailAdsress: string }) {
		const codeToken = this._generateCodeToken({ length: 6 })

		await this.redis.set(REDIS_KEYS.AUTH.EMAIL_VERIFICATION_CODE({ code: codeToken, userId }), userId)
		await this.redis.expire(REDIS_KEYS.AUTH.EMAIL_VERIFICATION_CODE({ code: codeToken, userId }), this.EMAIL_CODE_VERIFICATION_EXPIRE_MS / 1000)

		await this.emailService.sendEmail({
			subject: 'Linkerry - email verification',
			to: emailAdsress,
			reactEmailComponent: VerificationEmail,
			props: { verificationCode: codeToken },
		})
	}

	private _generateCodeToken({ length }: { length: number }) {
		const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
		let token = ''
		for (let i = 0; i < length; i++) {
			token += chars[Math.floor(Math.random() * chars.length)]
		}
		return token
	}

	verifyJwt(token: string) {
		return this.jwtService.decode(token)
	}

	async validateUser(email: string, pass: string): Promise<any> {
		const user = await this.usersService.findOneWithPassword({ email })
		const verifyPassword = await this.hashService.compare(pass, user?.password ?? '')
		if (user && verifyPassword) {
			const { password, ...result } = user.toObject()
			return { ...result, id: user.id }
		}
		return null
	}

	generateWorkerToken({ payload }: { payload: Omit<JwtWorkerTokenPayload, 'iss' | 'exp'> }): string {
		return this.jwtCustomService.generateToken({
			payload,
		})
	}

	async signUp(signUpDto: SignUpDto) {
		const hashedPassword = await this.hashService.hash(signUpDto.password)
		signUpDto.password = hashedPassword

		const user = await this.userModel.create({ ...signUpDto, roles: [UserRole.Customer] })
		this.logger.debug(`New signUp: ${signUpDto.email}`)

		/* create also default project for new user */
		const newProject = await this.projectsService.create({
			displayName: `${user.name}'s project`,
			notifyStatus: NotificationStatus.ALWAYS,
			owner: user.id,
			users: [user.id],
		})

		/* create default subscription */
		await this.subscriptionsService.createDefault(newProject.id)

		await this._sendVerificationCode({
			emailAdsress: user.email,
			userId: user.id,
		})

		return {
			user,
			access_token: this.jwtCustomService.generateToken({
				payload: {
					projectId: newProject.id,
					sub: user.id,
					type: JWTPrincipalType.CUSTOMER,
				},
			}),
		}
	}

	async login(user: User) {
		const userProjects = await this.projectsService.findManyUserProjects(user._id)

		return {
			user,
			access_token: this.jwtCustomService.generateToken({
				payload: {
					sub: user._id,
					type: JWTPrincipalType.CUSTOMER,
					projectId: userProjects[0]?.id,
				},
			}),
		}
	}

	async verifyEmailCode({ code, userId }: VerifyEmailCodeParams) {
		const cachedDataUserId = await this.redis.get(REDIS_KEYS.AUTH.EMAIL_VERIFICATION_CODE({ code, userId }))
		if (!cachedDataUserId) throw new UnprocessableEntityException(`Invalid Verification code or code expired`)
		if (cachedDataUserId !== userId) throw new UnprocessableEntityException(`Invalid Verification code for user`)

		const user = await this.userModel.findOneAndUpdate(
			{ _id: userId },
			{
				emailVerifiedAtDate: dayjs().toISOString(),
			},
			{
				new: true,
				projection: {
					password: 0,
				},
			},
		)

		/* Can be many codes, so delete all */
		const keysToDelete = await this.redis.keys(REDIS_KEYS.AUTH.EMAIL_VERIFICATION_CODE_WILDCARD({ userId }))
		await await this.redis.del(keysToDelete)

		return user
	}

	async resendEmailCode({ userId }: { userId: Id }) {
		/* check how many codes are in cache for given user */
		const keysToDelete = await this.redis.keys(REDIS_KEYS.AUTH.EMAIL_VERIFICATION_CODE_WILDCARD({ userId }))
		if (keysToDelete.length >= 3)
			throw new CustomError(
				`We have been send you 3 or more verification codes. Please check your email inbox, also spam. If you will still hava problem with verification, concact with our Team`,
				ErrorCode.EXCEED_CODES_AMOUNT,
			)

		const user = await this.usersService.findOne({
			_id: userId,
		})
		assertNotNullOrUndefined(user, 'user')

		await this._sendVerificationCode({
			emailAdsress: user.email,
			userId: user.id,
		})
	}
}

export interface VerifyEmailCodeParams {
	code: string
	userId: Id
}
