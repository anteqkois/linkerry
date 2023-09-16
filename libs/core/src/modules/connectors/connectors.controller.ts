import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { CreateConnectorDto } from './dto/create-connector.dto';
import { UpdateConnectorDto } from './dto/update-connector.dto';

@Controller('connectors')
export class ConnectorsController {
  constructor(private readonly connectorsService: ConnectorsService) {}

  // @Post()
  // create(@Body() createConnectorDto: CreateConnectorDto) {
  //   return this.connectorsService.create(createConnectorDto);
  // }

  // @Get()
  // findAll() {
  //   return this.connectorsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.connectorsService.findOne(+id);
  // }

  @Get('/metadata/:name')
  findOne(@Param('name') id: string) {
    return this.connectorsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateConnectorDto: UpdateConnectorDto) {
  //   return this.connectorsService.update(+id, updateConnectorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.connectorsService.remove(+id);
  // }
}
