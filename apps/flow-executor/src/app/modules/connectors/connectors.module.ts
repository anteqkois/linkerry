import { Module } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ConnectorsController } from './connectors.controller';

@Module({
  controllers: [ConnectorsController],
  providers: [ConnectorsService]
})
export class ConnectorsModule {}
