import { ConnectorsMetadataGetOneQuery } from '@linkerry/shared'
import { Transform } from 'class-transformer'
import { IsBoolean, IsOptional, IsSemVer } from 'class-validator'

export class ConnectorMetadataGetOneQueryDto implements ConnectorsMetadataGetOneQuery {
  @IsOptional()
  @Transform(({ value }) => {
    return value === 'false' ? false : true
  })
  @IsBoolean()
  readonly summary?: boolean

  @IsOptional()
  @IsSemVer()
  readonly version?: string
}
