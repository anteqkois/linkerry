import { Module } from '@nestjs/common';
import { ConnectorsService } from '../connectors/connectors.service';
import { TriggersController } from './triggers.controller';
import { TriggersService } from './triggers.service';

@Module({
  controllers: [TriggersController],
  providers: [TriggersService, ConnectorsService]
})
export class TriggersModule {}
