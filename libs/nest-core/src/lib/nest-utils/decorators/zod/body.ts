import { Body } from "@nestjs/common"
import { ZodSchema } from "zod"
import { ZodValidationPipe } from "../../pipes/zod-validation.pipe"

export const BodySchema = (schema: ZodSchema) => {
	return Body(new ZodValidationPipe(schema))
}
