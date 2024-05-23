import { idSchema } from '@linkerry/shared'
import { Param } from '@nestjs/common'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

export const ParamIdSchema = () => {
  return Param('id', new ZodValidationPipe(idSchema))
}
