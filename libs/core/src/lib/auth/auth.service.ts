import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument, UsersService } from '../../modules/users'
import { SignUpDto } from './dto/sign-up.dto'
import { HashService } from './hash.service'
import { IUser, JWTToken, UserRoleTypes } from '@market-connector/types'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
    private jwtService: JwtService,
    private hashService: HashService,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

  createJWTPayload(user: Pick<UserDocument, 'name' | 'id'>): JWTToken {
    return { name: user.name, sub: user.id }
  }

  async signUp(signUpDto: SignUpDto) {
    const hashedPassword = await this.hashService.hash(signUpDto.password)
    signUpDto.password = hashedPassword

    const user = await this.userModel.create({ ...signUpDto, roles: [UserRoleTypes.CUSTOMER] })
    this.logger.debug(`New signUp: ${signUpDto.email}`)

    const payload = this.createJWTPayload(user)
    const secret = this.configService.get('JWT_SECRET')
    return {
      user,
      access_token: this.jwtService.sign(payload, { secret }),
    }
  }

  async login(user: IUser) {
    const payload = this.createJWTPayload(user)
    const secret = this.configService.get('JWT_SECRET')

    return {
      user,
      access_token: this.jwtService.sign(payload, { secret }),
    }
  }
}
