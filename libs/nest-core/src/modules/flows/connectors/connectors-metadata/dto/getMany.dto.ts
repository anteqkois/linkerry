import { ConnectorsMetadataGetManyQuery } from '@linkerry/shared'
import { Type } from 'class-transformer'
import { IsBoolean, IsOptional, IsString } from 'class-validator'
import { PaginationDto } from '../../../../../lib/nest-utils/dto/pagination.dto'

export class ConnectorMetadataGetManyQueryDto extends PaginationDto implements ConnectorsMetadataGetManyQuery {
  @IsString()
  @IsOptional()
  readonly displayName?: string | undefined

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  readonly summary?: boolean = true
}
