import { ExchangeCode, IExchange_GetQuery, TimeFrameCode } from '@market-connector/types'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { PaginationDto } from '../../../lib/utils/dto/pagination.dto'

export class GetManyExchangesQueryDto extends PaginationDto implements IExchange_GetQuery {
  @IsEnum(ExchangeCode)
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly code?: ExchangeCode

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly symbol?: string

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly name?: string



  @IsEnum(TimeFrameCode)
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly timeframes: TimeFrameCode
}
