import { IPaginationQuery } from '@market-connector/types'
import { Transform } from 'class-transformer'
import { IsInt, IsOptional, Max } from 'class-validator'

export class PaginationDto implements IPaginationQuery {
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
