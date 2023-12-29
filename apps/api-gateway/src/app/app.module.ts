import { AuthModule, ConnectorsMetadataModule, CoreModule, FlowVersionsModule, FlowsModule, UsersModule } from '@market-connector/nest-core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConnectorsModule } from './modules/connectors/connectors.module'

@Module({
  imports: [CoreModule, UsersModule, AuthModule, ConnectorsModule, FlowsModule, FlowVersionsModule, ConnectorsMetadataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
