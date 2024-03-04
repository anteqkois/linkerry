import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConnectorsMetadataService } from './connectors-metadata.service'
import { ConnectorsMetadataModelFactory } from './schemas/connector.schema'

@Module({
	imports: [MongooseModule.forFeatureAsync([ConnectorsMetadataModelFactory])],
	providers: [ConnectorsMetadataService],
	exports: [ConnectorsMetadataService],
})
export class ConnectorsMetadataModule {}
