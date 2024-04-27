import { CustomError, ErrorCode } from '@linkerry/shared'
import { Query } from '@nestjs/common'
import { ZodSchema } from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'

export function QuerySchema(schemaOrName: ZodSchema): ParameterDecorator
export function QuerySchema(schemaOrName: string, schema: ZodSchema): ParameterDecorator
export function QuerySchema(schemaOrName: ZodSchema | string, schema?: ZodSchema) {
	if (typeof schemaOrName === 'string' && schema) {
		return Query(schemaOrName, new ZodValidationPipe(schema))
	} else if (typeof schemaOrName === 'object') return Query(new ZodValidationPipe(schemaOrName))
	else
		throw new CustomError('Invalid query definition', ErrorCode.INVALID_TYPE, {
			schemaOrName,
			schema,
		})
}
