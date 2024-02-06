import { Module } from '@nestjs/common';
import { ConnectorsService } from './connectors.service';
import { ConnectorsController } from './connectors.controller';
import { ConnectorsMetadataService } from './connectors-metadata/connectors-metadata.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectorMetadataModelFactory } from './connectors-metadata/schemas/connector.schema';

@Module({
	imports:[MongooseModule.forFeatureAsync([ConnectorMetadataModelFactory])],
  controllers: [ConnectorsController],
  providers: [ConnectorsService, ConnectorsMetadataService],
	exports:[ConnectorsService, ConnectorsMetadataService],
})
export class ConnectorsModule {}
