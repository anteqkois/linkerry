import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConnectorsModule } from './modules/connectors/connectors.module'
import { AuthModule, CoreModule, FlowsModule, UsersModule } from '@market-connector/core'

@Module({
  imports: [CoreModule, UsersModule, AuthModule, ConnectorsModule, FlowsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
