import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ConnectorsMetadataService } from './connectors-metadata.service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { UseJwtGuard } from '../../lib/utils/decorators/jwt-auth-guard.decorator';
import { ReqJwtUser } from '../../lib/auth/decorators/req-user.decorator';
import { JwtUser } from '@market-connector/shared';

@Controller('connectors-metadata')
export class ConnectorsMetadataController {
  constructor(private readonly connectorsMetadataService: ConnectorsMetadataService) {}


  // TODO only admin
  // @UseJwtGuard()
  // @Post()
  // create(@Body() createDto: CreateDto, @ReqJwtUser() user: JwtUser) {
  //   return this.connectorsMetadataService.create(user.id, createDto);
  // }

  @Get()
  findAll() {
    return this.connectorsMetadataService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.connectorsMetadataService.findOne(id);
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
