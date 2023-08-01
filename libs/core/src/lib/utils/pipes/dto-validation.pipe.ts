import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  Logger,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common'
import { validate } from 'class-validator'
import { plainToInstance } from 'class-transformer'

export class DtoException extends HttpException {
  constructor(message: string, public field: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export const exceptionFactoryDto = (errors: ValidationError[]) => {
  throw new DtoException(
    Object.values(errors[0].constraints ?? {})[0] ?? 'Unknown validation error',
    errors[0].property,
  )
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  logger: Logger = new Logger('DTO Validation')

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }
    const object = plainToInstance(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      this.logger.error(errors)
      const constraints = errors.map(
        (error) =>
          `${error.property[0].toUpperCase() + error.property.slice(1)}: ${Object.values(error.constraints ?? {})}`,
      )
      throw new DtoException(constraints.join(', '), 'unknown')
    }
    return value
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
