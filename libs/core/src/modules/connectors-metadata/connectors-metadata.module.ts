import { Module } from '@nestjs/common';
import { ConnectorsMetadataService } from './connectors-metadata.service';
import { ConnectorsMetadataController } from './connectors-metadata.controller';

@Module({
  controllers: [ConnectorsMetadataController],
  providers: [ConnectorsMetadataService]
})
export class ConnectorsMetadataModule {}
