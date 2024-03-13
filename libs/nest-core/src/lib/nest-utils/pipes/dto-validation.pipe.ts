import {
	ArgumentMetadata,
	HttpException,
	HttpStatus,
	Injectable,
	Logger,
	PipeTransform,
	ValidationError,
} from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { validate } from 'class-validator'

export class DtoException extends HttpException {
  constructor(message: string, public field: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY)
  }
}

export const exceptionFactoryDto = (errors: ValidationError[]) => {
  let lastErrors = errors
  while(lastErrors[0].children && lastErrors[0].children?.length > 0){
    lastErrors = lastErrors[0].children
  }

  throw new DtoException(
    `${Object.values(lastErrors[0]?.constraints ?? {})[0] ?? 'Unknown validation error'}. Receive: ${lastErrors[0].value}`,
    lastErrors[0].property,
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

  // eslint-disable-next-line @typescript-eslint/ban-types
  private toValidate(metatype: Function): boolean {
		// eslint-disable-next-line @typescript-eslint/ban-types
    const types: Function[] = [String, Boolean, Number, Array, Object]
    return !types.includes(metatype)
  }
}
