import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectorsMetadataController } from './connectors-metadata.controller';
import { ConnectorsMetadataService } from './connectors-metadata.service';
import { ConnectorMetadataModelFactory } from './schemas/connector.schema';

@Module({
  imports: [MongooseModule.forFeatureAsync([ConnectorMetadataModelFactory])],
  controllers: [ConnectorsMetadataController],
  providers: [ConnectorsMetadataService]
})
export class ConnectorsMetadataModule {}
