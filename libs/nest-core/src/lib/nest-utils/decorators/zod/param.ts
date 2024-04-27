import { Param } from "@nestjs/common"
import { ZodSchema } from "zod"
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe"

export const ParamSchema = (paramName: string, schema: ZodSchema) => {
	return Param(paramName, new ZodValidationPipe(schema))
}
