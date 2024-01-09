import { Controller, Get, Param, Query } from '@nestjs/common'
import { MongoFilter, QueryToMongoFilter } from '../../lib/mongodb/decorators/filter.decorator'
import { ConnectorsMetadataService } from './connectors-metadata.service'
import { ConnectorMetadataGetManyQueryDto } from './dto/getMany.dto'
import { ConnectorMetadataGetOneQueryDto } from './dto/getOne.dto'

@Controller('connectors-metadata')
export class ConnectorsMetadataController {
  constructor(private readonly connectorsMetadataService: ConnectorsMetadataService) {}

  @Get()
  findAll(
    @QueryToMongoFilter({
      exclude: ['summary'],
    })
    filter: MongoFilter<ConnectorMetadataGetManyQueryDto>,
    @Query() query: ConnectorMetadataGetManyQueryDto,
  ) {
    return this.connectorsMetadataService.findAll(filter, query)
  }

  @Get(':name')
  findOne(@Param('name') name: string, @Query() query: ConnectorMetadataGetOneQueryDto) {
    return this.connectorsMetadataService.findOne(name, query)
  }
}
