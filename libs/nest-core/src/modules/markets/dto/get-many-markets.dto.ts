import { ExchangeCode, IMarket_GetQuery, MarketType } from '@market-connector/types'
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { PaginationDto } from '../../../lib/utils/dto/pagination.dto'

export class GetManyMarketsQueryDto extends PaginationDto implements IMarket_GetQuery {
  @IsBoolean()
  @IsOptional()
  readonly active?: boolean

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly base?: string

  @IsEnum(ExchangeCode)
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly exchangeCode?: ExchangeCode

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly quote?: string

  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly symbol?: string

  @IsEnum(MarketType)
  @IsOptional()
  @MinLength(2)
  @MaxLength(20)
  readonly type?: MarketType = MarketType.spot
}
