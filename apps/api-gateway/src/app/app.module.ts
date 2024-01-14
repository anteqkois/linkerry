import { AuthModule, ConnectorsMetadataModule, CoreModule, FlowVersionsModule, FlowsModule, UsersModule } from '@market-connector/nest-core'
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'

@Module({
  imports: [CoreModule, UsersModule, AuthModule, FlowsModule, FlowVersionsModule, ConnectorsMetadataModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
