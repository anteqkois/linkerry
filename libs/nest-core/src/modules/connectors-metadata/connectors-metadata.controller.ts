import { Controller, Get, Param } from '@nestjs/common'
import { MongoFilter, QueryToMongoFilter } from '../../lib/mongodb/decorators/filter.decorator'
import { ConnectorsMetadataService } from './connectors-metadata.service'
import { GetConnectorMetadataQueryDto } from './dto/get.dto'

@Controller('connectors-metadata')
export class ConnectorsMetadataController {
  constructor(private readonly connectorsMetadataService: ConnectorsMetadataService) {}

  @Get()
  findAll(
    @QueryToMongoFilter({
      displayName: 'name',
    })
    filter: MongoFilter<GetConnectorMetadataQueryDto>,
  ) {
    return this.connectorsMetadataService.findAll(filter)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectorsMetadataService.findOne(id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConnectorsMetadatumDto: UpdateDto) {
  //   return this.connectorsMetadataService.update(+id, updateConnectorsMetadatumDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.connectorsMetadataService.remove(+id);
  // }
}
