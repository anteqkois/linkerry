import { PaginationQuery } from '@linkerry/shared'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max } from 'class-validator'

export class PaginationDto implements PaginationQuery {
  @IsInt()
  @Max(300)
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  readonly limit = 100

  @IsInt()
  @Max(10_000)
  @IsOptional()
  @Transform(({ value }) => Number.parseInt(value))
  readonly offset = 0
}
