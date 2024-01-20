import { AuthModule, ConnectorsMetadataModule, CoreModule, FlowVersionsModule, FlowsModule, TriggerEventsModule, UsersModule } from '@linkerry/nest-core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [CoreModule, UsersModule, AuthModule, FlowsModule, FlowVersionsModule, ConnectorsMetadataModule, TriggerEventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
