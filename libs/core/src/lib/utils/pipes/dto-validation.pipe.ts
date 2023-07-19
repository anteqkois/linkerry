import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger, UnprocessableEntityException, HttpException, HttpStatus } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

export class DtoException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  logger: Logger = new Logger('DTO Validation')

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      this.logger.error(errors)
      const constraints = errors.map(error => `${error.property[0].toUpperCase()+error.property.slice(1)}: ${Object.values(error.constraints ?? {})}`)
      throw new DtoException(constraints.join(', '));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
