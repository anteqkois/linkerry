import { JWTPrincipalType, JwtCustomerTokenPayload, JwtWorkerTokenPayload, User, UserRole } from '@linkerry/shared'
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { UserDocument, UserModel, UsersService } from '../../modules/users'
import { SignUpDto } from './dto/sign-up.dto'
import { HashService } from './hash.service'
import { JWTService } from './jwt.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private usersService: UsersService,
    private jwtService: JWTService,
    private hashService: HashService,
    @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneWithPassword({ email })
    const verifyPassword = await this.hashService.compare(pass, user?.password ?? '')
    if (user && verifyPassword) {
      const { password, ...result } = user.toObject()
      return { ...result, id: user.id }
    }
    return null
  }

  createCustomerJWTPayload(user: Pick<UserDocument, 'name' | 'id'>): JwtCustomerTokenPayload {
    return { name: user.name, sub: user.id, type: JWTPrincipalType.CUSTOMER }
  }

  generateWorkerToken({payload}:{payload: JwtWorkerTokenPayload}): string {
    return  this.jwtService.generateToken({
			payload
		})
  }

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await this.hashService.hash(signUpDto.password)
    signUpDto.password = hashedPassword

    const user = await this.userModel.create({ ...signUpDto, roles: [UserRole.Customer] })
    this.logger.debug(`New signUp: ${signUpDto.email}`)

    const payload = this.createCustomerJWTPayload(user)
    return {
      user,
      access_token: this.jwtService.generateToken({
				payload
			})
    }
  }

  async login(user: User) {
    const payload = this.createCustomerJWTPayload(user)

    return {
      user,
      access_token: this.jwtService.generateToken({
				payload
			})
    }
  }
}
