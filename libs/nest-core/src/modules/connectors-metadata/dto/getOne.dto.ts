import { ConnectorsMetadataGetOneQuery } from '@market-connector/shared'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional } from 'class-validator'
import { PaginationDto } from '../../../lib/utils/dto/pagination.dto'

export class ConnectorMetadataGetOneQueryDto extends PaginationDto implements ConnectorsMetadataGetOneQuery {
  @IsOptional()
  @Transform(({ value }) => {
    return value === 'false' ? false : true
  })
  @IsBoolean()
  readonly summary?: boolean
}
