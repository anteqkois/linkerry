import { JWTPrincipalType } from '@linkerry/shared'
import { SetMetadata } from '@nestjs/common'

export const REQUIRED_JWT_TYPE_KEY = 'requiredJwtType'
export const RequiredJwtType = (type: JWTPrincipalType) => SetMetadata(REQUIRED_JWT_TYPE_KEY, type)
