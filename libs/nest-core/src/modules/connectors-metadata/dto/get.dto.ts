// import { ExchangeCode, IExchange_GetQuery, TimeFrameCode } from '@market-connector/types'
// import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
// import { PaginationDto } from '../../../lib/utils/dto/pagination.dto'

import { ConnectorsMetadataQuery } from '@market-connector/shared'
import { IsOptional, IsString } from 'class-validator'
import { PaginationDto } from '../../../lib/utils/dto/pagination.dto'

export class GetConnectorMetadataQueryDto extends PaginationDto implements ConnectorsMetadataQuery {
  @IsString()
  @IsOptional()
  readonly displayName?: string | undefined
}
