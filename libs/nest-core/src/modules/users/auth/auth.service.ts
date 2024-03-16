import { JWTPrincipalType, JwtWorkerTokenPayload, NotificationStatus, User, UserRole } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { HashService } from '../../../lib/auth/hash.service'
import { JWTCustomService } from '../../../lib/auth/jwt-custom.service'
import { ProjectsService } from '../../projects/projects.service'
import { UserDocument, UserModel } from '../schemas/user.schema'
import { UsersService } from '../users.service'
import { SignUpDto } from './dto/sign-up.dto'

@Injectable()
export class AuthService {
	private readonly logger = new Logger(AuthService.name)

	constructor(
		@InjectModel(UserModel.name) private userModel: Model<UserDocument>,
		private usersService: UsersService,
		private jwtCustomService: JWTCustomService,
		private hashService: HashService,
		private projectsService: ProjectsService,
		private readonly jwtService: JwtService,
	) {}

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
			ownerId: user.id,
			users: [user.id],
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
}
