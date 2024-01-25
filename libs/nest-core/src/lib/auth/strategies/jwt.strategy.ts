import { Cookies, JwtCustomerTokenPayload } from '@linkerry/shared'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([JwtStrategy.extractJWTFromCookie]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      usernameField: 'name',
    })
  }

  private static extractJWTFromCookie(req: { cookies: { [Cookies.ACCESS_TOKEN]?: string } }): string | null {
    if (req.cookies && req.cookies[Cookies.ACCESS_TOKEN]) {
      return req.cookies[Cookies.ACCESS_TOKEN]
    }
    return null
  }

  async validate(payload: JwtCustomerTokenPayload) {
    // todo check for privilages using calb ? Logic to get privilages from db
    return { id: payload.sub, name: payload.name }
  }
}
